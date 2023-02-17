"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../ExpressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { id, username, first_name, last_name, email, bio, is_admin }
   *
   * Throws UnauthorizedError if user is not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT id,
                  username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
          [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { id, username, firstName, lastName, email, bio, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, 
                          password, 
                          first_name, 
                          last_name, 
                          email, 
                          bio, 
                          is_admin }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
          [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users(username,
                             password,
                             first_name,
                             last_name,
                             email,
                             bio,
                             is_admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, 
                      username, 
                      first_name AS "firstName", 
                      last_name AS "lastName", 
                      email, 
                      bio, 
                      is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          first_name,
          last_name,
          email,
          bio,
          is_admin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users (optional filter on searchFilters).
   * 
   * searchFilters (all optional):
   *  - username
   * - first_name (will find case_insensitive, partial matches)
   * - last_name (will find case_insensitive, partial matches)
   *
   * Returns [{ id, username, first_name, last_name, email, bio, is_admin }, ...]
   **/

  static async findAll(searchFilters = {}) {

    let query = `SELECT id, 
                        username,
                        first_name AS "firstName",
                        last_name AS "lastName",
                        email,
                        bio,
                        is_admin AS "isAdmin"
                FROM users`;

    let whereExpressions = [];
    let queryValues = [];

    const { username, first_name, last_name } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so that we can generate the correct SQL

    if (username) {
      queryValues.push(`${username}`);
      whereExpressions.push(`username ILIKE $${queryValues.length}`);
    }
    
    if (first_name) {
      queryValues.push(`${first_name}`);
      whereExpressions.push(`first_name ILIKE $${queryValues.length}`);
    }

    if (last_name) {
      queryValues.push(`${last_name}`);
      whereExpressions.push(`last_name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results
          
    query += " ORDER BY username";

    const usersRes = await db.query(query, queryValues);

    return usersRes.rows;
    
  }

  /** Given a user_id, return data about user.
   *
   * Returns { id, username, first_name, last_name, bio, is_admin, tripcards, reviews }
   * 
   *   where tripcard is { id, destination_id, user_id, username, city, state, country, created_on, keep_private, has_visited }
   * 
   * where review is { id, user_id, username, business_id, business_name, text, rating, created_on, image_url }
   * 
   * where follows is { id, user_being_followed_id, user_following_id }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const userRes = await db.query(
          `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           WHERE id = $1`,
        [id],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);

  
    // user's tripcards
    const userTripcardsRes = await db.query(
          `SELECT t.id,
                  t.destination_id,
                  t.user_id,
                  t.username,
                  t.city,
                  t.state,
                  t.country,
                  t.created_on,
                  t.has_visited,
                  t.keep_private                   
           FROM tripcards t
           WHERE t.user_id = $1`, [id]);

    // user.tripcards = userTripcardsRes.rows.map(t => t.destination_id);
    user.tripcards = userTripcardsRes.rows;


    // user's reviews
    const userReviewsRes = await db.query(
        `SELECT r.id,
                r.user_id, 
                r.username,
                r.business_id, 
                r.business_name,
                r.text,
                r.rating, 
                r.created_on, 
                r.image_url
       FROM reviews r
       WHERE r.user_id = $1`, [id]);

    user.reviews = userReviewsRes.rows;   
  
    return user;
  }

  
  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, bio, isAdmin }
   *
   * Returns { username, firstName, lastName, email, bio, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this or serious security risks are opened.
   */
  
  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          email: "email",
          bio: "bio",
          isAdmin: "is_admin",
        });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${usernameVarIdx} 
                      RETURNING id,
                                username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                bio,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);

    delete user.password;
    return user;
  }


  /** Delete given user from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
            `DELETE 
             FROM users
             WHERE id = $1
             RETURNING id`,
             [id],
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`This user does not exist: ${id}`);
  }
    
}


module.exports = User;