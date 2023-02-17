"use strict";

const db = require("../db");
const { NotFoundError } = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for tripcards */

class Tripcard {

   /** Create a tripcard for destination(from data), update db, return new tripcard data.
   * 
   * data should be { destination_id, user_id, city, state, country, created_on, has_visited, keep_private }
   * 
   * Returns { id, destination_id, user_id, city, state, country, created_on, keep_private, has_visited }
   * 
   */

   static async create(data) {
    
    let result = await db.query(
                          `INSERT INTO tripcards (user_id,
                                                  destination_id, 
                                                  username,
                                                  city,
                                                  state,
                                                  country,
                                                  created_on,
                                                  keep_private,
                                                  has_visited)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            RETURNING id, 
                                  destination_id,
                                  user_id,
                                  username, 
                                  city,
                                  state,
                                  country,
                                  created_on, 
                                  keep_private, 
                                  has_visited`,
                            [
                              data.user_id,
                              data.destination_id,
                              data.username,
                              data.city,
                              data.state,
                              data.country,
                              data.created_on,
                              data.keep_private,
                              data.has_visited
                            ]);

    let tripcard = result.rows[0];

    return tripcard;
  }

   
 /** Find all tripcards (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - user_id
   * - user_name (will find case-insensitive, partial matches)
   * - destination_id
   * - city
   * - state
   * - country
   * 
   * Returns [{ id, destination_id, user_id, username, city, state, country, created_on, keep_private, has_visited }, ...]
   * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT id,
                        destination_id,
                        user_id,
                        username,
                        city,
                        state,
                        country,
                        created_on,
                        keep_private,
                        has_visited
                  FROM tripcards`;
    
    let whereExpressions = [];
    let queryValues = [];

    const { destination_id, username, user_id, city, state, country, has_visited, keep_private } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so we can generate the correct SQL

    if (state !== undefined) {
      queryValues.push(`%${state}%`);
      whereExpressions.push(`state ILIKE $${queryValues.length}`);
    }

    if (country) {
      queryValues.push(`%${country}%`);
      whereExpressions.push(`country ILIKE $${queryValues.length}`);
    }

    if ( city !== undefined) {
      queryValues.push(`%${city}%`);
      whereExpressions.push(`city ILIKE $${queryValues.length}`);
    }


    if (destination_id !== undefined) {
      queryValues.push(destination_id);
      whereExpressions.push(`destination_id = $${queryValues.length}`);
    }

    if (user_id !== undefined) {
      queryValues.push(user_id);
      whereExpressions.push(`user_id = $${queryValues.length}`);
    }

    if (username !== undefined) {
      queryValues.push(username);
      whereExpressions.push(`username ILIKE $${queryValues.length}`);
    }

    if (has_visited == true) {
      queryValues.push(has_visited);
      whereExpressions.push(`has_visited = $${queryValues.length}`);
    }

    if (keep_private == true) {
      queryValues.push(keep_private);
      whereExpressions.push(`keep_private = $${queryValues.length}`);
    }
    

    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY city";

    const tripcardsRes = await db.query(query, queryValues);
    return tripcardsRes.rows;
  }

 
  /*** Given a tripcard id, return data about a tripcard
   * 
   * Returns [{ id, destination_id, user_id, username, city, state, country, created_on, keep_private, has_visited}
   * 
   * Throws NotFoundError if not found
   */

  static async get(id) {
    const tripcardRes = await db.query(
      `SELECT id, 
              destination_id, 
              user_id, 
              username,
              city,
              state,
              country,
              created_on, 
              keep_private, 
              has_visited
      FROM tripcards
      WHERE id = $1`,
      [id]);

      const tripcard = tripcardRes.rows[0];

      if (!tripcard) throw new NotFoundError(`No tripcard: ${id} found`);
      

      // tripcard businesses
      const tripcardBusinessesRes = await db.query(
          `SELECT t.id,
                  t.tripcard_id,
                  t.business_id
           FROM tripcardbusinesses AS t
           WHERE t.tripcard_id = $1`,
           [id]);

      tripcard.tripcardBusinesses = tripcardBusinessesRes.rows
      return tripcard;
  }


  /*** Given a tripcard id and business id, add a business to the tripcard
   * 
   * Returns [{ tripcardbusiness_id, tripcard_id, business_id }
   * 
   */

   static async addBusinessToTripcard(id, business_id) {
   
    const result = await db.query(
            `INSERT INTO tripcardbusinesses (tripcard_id, business_id)
             VALUES ($1, $2)
             RETURNING tripcard_id, business_id`,
            [id, business_id]);

    let tripcardBusiness = result.rows[0]

    return tripcardBusiness;
  }
  


  /*** Given a tripcard id, get a list of all businesses on the tripcard.  
   * 
   * Throws NotFoundError if tripcard id is not found
   */

   static async getTripcardBusinesses(id) {

    const result = await db.query(
          `SELECT b.*
            FROM businesses AS b
            JOIN tripcardbusinesses as t
            ON b.id = t.business_id
            WHERE t.tripcard_id = $1`,
            [id]);

    if (!result) throw new NotFoundError(`No businesses on this card: ${id}`);

    return result.rows;
    
   }


  /*** Given a tripcard id and business id, remove a business from the tripcard
   * 
   * Throws NotFoundError if tripcard or business id is not found
   */

   static async removeBusinessFromTripcard(tripcard_id, business_id) {

    const result = await db.query(
      `DELETE FROM tripcardbusinesses
       WHERE tripcard_id = $1 AND business_id = $2
       RETURNING id`,
       [tripcard_id, business_id]);

    if (!result) throw new NotFoundError(`No businesses on this tripcard: ${business_id}`);

    return result.rows;
  }
  

  /** Update tripcard data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { keep_private, has_visited }
   *
   * Returns { id, destination_id, user_id, username, city, state, country, created_on, keep_private, has_visited}
   *
   * Throws NotFoundError if not found.
   */

   static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          keepPrivate: "keep_private",
          hasVisited: "has_visited"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE tripcards 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                destination_id, 
                                user_id, 
                                username,
                                city,
                                state,
                                country,
                                created_on, 
                                keep_private,
                                has_visited`;

    const result = await db.query(querySql, [...values, id]);
    const tripcard = result.rows[0];

    if (!tripcard) throw new NotFoundError(`No tripcard: ${id}`);

    return tripcard;
  }



  /** Delete given tripcard from database; returns undefined.
   *
   * Throws NotFoundError if tripcard not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM tripcards
           WHERE id = $1
           RETURNING id`,
        [id]);
    const tripcard = result.rows[0];

    if (!tripcard) throw new NotFoundError(`This tripcard does not exist: ${id}`);
  }


  /** Find top number of destinations (default is 6) that have been added to tripcards  */


  static async findTopDestinations(limit=6) {
    const result = await db.query(
            `SELECT  destination_id, COUNT(destination_id) AS "mostAdded" 
             FROM tripcards 
             GROUP BY destination_id 
             ORDER BY "mostAdded" DESC
             LIMIT ${limit}`);

    return result.rows;
  }

}


module.exports = Tripcard;


