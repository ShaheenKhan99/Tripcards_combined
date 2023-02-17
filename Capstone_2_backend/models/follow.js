"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../ExpressError");
const User = require("./user");


/** Related functions for follows */

class Follow { 

  /*** Given a user being followed id and a user following id, create a follow relationship 
   * 
   * Returns { id, user_being_followed_id, user_following_id }
   * 
   */

   static async followUser(user_being_followed_id, user_following_id){

    // Check if users are distinct
    if (user_being_followed_id === user_following_id) {
      throw new BadRequestError(`Cannot follow self: ${user_being_followed_id}`);
    }
    
    // Check if user is already following other user
    const duplicateCheck = await db.query(
          `SELECT user_being_followed_id, user_following_id
           FROM follows
           WHERE user_being_followed_id = $1 AND user_following_id = $2`,
           [user_being_followed_id, user_following_id]);

           if (duplicateCheck.rows[0]) 
           throw new BadRequestError(`User is already following this user: ${user_being_followed_id}`);
    
    const result = await db.query(
                `INSERT INTO follows (user_being_followed_id,       user_following_id)
                 VALUES ($1, $2)
                 RETURNING id, user_being_followed_id, user_following_id`,
            [user_being_followed_id, user_following_id]);

            let follow = result.rows[0];

            return follow;
  }

   /*** Given a user_being_followed_id, get a list of all followers for that user
   */

   static async getAllFollowers (user_being_followed_id) {

    const result = await db.query(
          `SELECT u.*
            FROM users AS u
            JOIN follows as f
            ON u.id = f.user_following_id
            WHERE f.user_being_followed_id = $1`,
            [user_being_followed_id]);

    return result.rows;
    
   }

  /*** Given a user_following_id, get a list of all the users the user is following */

    static async getUsersFollowed (user_following_id) {

      const result = await db.query(
            `SELECT u.*
              FROM users AS u
              JOIN follows as f
              ON u.id = f.user_being_followed_id
              WHERE f.user_following_id = $1`,
              [user_following_id]);
  
      return result.rows;
     }

  /*** Given a user_being_followed_id and a user_following_id, remove user as following
   * 
   * Throws NotFoundError if user_being_followed_id and a user_following_id is not found
   */

  static async unFollowUser(user_being_followed_id, user_following_id ) {
    const result = await db.query(
      `DELETE FROM follows
       WHERE user_being_followed_id = $1
       AND user_following_id  = $2
       RETURNING user_following_id `,
       [user_being_followed_id, user_following_id ]);

    if (!result) throw new NotFoundError(`User is not being followed: ${user_being_followed_id}`);

    return result.rows;
  }
}

module.exports = Follow;

