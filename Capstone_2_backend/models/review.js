"use strict";

const db = require("../db");
const { NotFoundError } = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for reviews. */

class Review {

/** Create a review (from data), update db and return new review data. 
   * 
   * data should be { user_id, , username, business_id, business_name, text, rating, created_on, image_url }
   * 
   * Returns { id, user_id, username, business_id, business_name, text, rating, created_on, image_url }
   * 
   */

  static async create(data) {

  const result = await db.query(
                        `INSERT INTO reviews (
                                        business_id,
                                        business_name,
                                        user_id, 
                                        username, 
                                        text, 
                                        rating,
                                        created_on, 
                                        image_url
                                      )
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                          RETURNING id, 
                                    business_id,
                                    business_name, 
                                    user_id,
                                    username, 
                                    text, 
                                    rating,
                                    created_on, 
                                    image_url`, 
                                  [
                                    data.business_id, 
                                    data.business_name,
                                    data.user_id, 
                                    data.username,
                                    data.text, 
                                    data.rating,
                                    data.created_on,
                                    data.image_url
                                  ]
                            );

    const review = result.rows[0];

    return review;                             
  }
  

  /** Find all reviews (optional filter on searchFilters).
   * 
   * searchFilters(all optional):
   * - user_id
   * - username
   * - business_id
   * - business_name,
   * - rating
   * 
   * Returns [{ id, user_id, username, business_id, business_name, text, rating, created_on, image_url }, ...]
   * 
   */

   static async findAll(searchFilters = {}) {
    let query = `SELECT id, 
                        business_id, 
                        business_name,
                        user_id, 
                        username,
                        text, 
                        rating,
                        created_on, 
                        image_url
                  FROM reviews`;

    let whereExpressions = [];
    let queryValues = [];

    const { user_id, username, business_id, business_name, rating } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so we can generate the right SQL

    if(business_id) {
      queryValues.push(business_id);
      whereExpressions.push(`business_id = $${queryValues.length}`);
    }

    if (username) {
      queryValues.push(`%${username}%`);
      whereExpressions.push(`username ILIKE $${queryValues.length}`);
    }

    if (business_name) {
      queryValues.push(`%${business_name}%`);
      whereExpressions.push(`business_name ILIKE $${queryValues.length}`);
    }

    if(user_id) {
      queryValues.push(user_id);
      whereExpressions.push(`user_id = $${queryValues.length}`);
    }

    if(rating) {
      queryValues.push(rating);
      whereExpressions.push(`rating >= $${queryValues.length}`);
    }

    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results;
    query += " ORDER BY business_name";

    const reviewsRes = await db.query(query, queryValues);

    return reviewsRes.rows;
  }


  /** Given a review id, return data about the review 
   * 
   * Returns { id, user_id, username, business_id, business_name, text, rating, image_url } 
   * 
   * Throws NotFoundError if not found.
  */

   static async get(id) {
    const reviewRes = await db.query(
              `SELECT id, 
                      business_id, 
                      business_name,
                      user_id,
                      username, 
                      text, 
                      rating, 
                      created_on,
                      image_url
              FROM reviews
              WHERE id = $1`, 
              [id]);

    const review = reviewRes.rows[0];

    if (!review) throw new NotFoundError(`No review" ${id}`);

    return review;                    
  }

   /** Update review data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { text, username, image_url, rating }
   *
   * Returns { id, user_id, username, business_id, business_name, text, rating, created_on, image_url }
   *
   * Throws NotFoundError if not found.
   */

    static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          text: "text",
          username: "username",
          image_url: "image_url",
          rating: "rating"
        });
  
        const idVarIdx = "$" + (values.length + 1);
  
        const querySql = `UPDATE reviews
                          SET ${setCols}
                          WHERE id = ${idVarIdx}
                          RETURNING id, 
                                    business_id, 
                                    business_name,
                                    user_id,
                                    username, 
                                    text, 
                                    rating,
                                    created_on, 
                                    image_url
                                    `;
  
      const result = await db.query(querySql, [...values, id]);
      const review = result.rows[0];
                                
      if (!review) throw new NotFoundError(`No review: ${id}`);
                                
      return review;
    }
  
    
    /** Delete given review from database; returns undefined.
     *
     * Throws NotFoundError if review not found.
     **/
  
     static async remove(id) {
      const result = await db.query(
            `DELETE
             FROM reviews
             WHERE id = $1
             RETURNING id`,
          [id]);
  
      const review = result.rows[0];
  
      if (!review) throw new NotFoundError(`This review does not exist: ${id}`);
    }  
  }


module.exports = Review;

