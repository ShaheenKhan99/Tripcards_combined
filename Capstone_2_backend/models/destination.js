"use strict";

const db = require("../db");
const { NotFoundError } = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for destinations. */

class Destination {
  /** Create a destination (from data), update db and return new destination data. 
   * 
   * data should be { city, state, country, latitude, longitude }
   * 
   * Returns { id, city, state, country, latitude, longitude }
   * 
   */

  static async create({ city, state, country, latitude, longitude }) {

  const result = await db.query(
                          `INSERT INTO destinations (city, 
                                                     state, 
                                                     country, 
                                                     latitude, 
                                                     longitude)
                            VALUES($1, $2, $3, $4, $5)
                            RETURNING id, 
                                      city, 
                                      state, 
                                      country, 
                                      latitude, 
                                      longitude`, 
                                   [
                                    city, 
                                    state, 
                                    country, 
                                    latitude, 
                                    longitude 
                                  ]
                          );

  const destination = result.rows[0];

  return destination;

  }

  /** Find all destinations (optional filter on  searchFilters).
   * 
   * searchFilters(all optional - will find case-insensitive, partial matches):
   * - country
   * - city
   * - state
   * 
   * Returns [{ id, city, state, country, latitude, longitude }, ...]
   * 
   */

  static async findAll(searchFilters = {}) {

    let query = `SELECT id, 
                        city, 
                        state, 
                        country, 
                        latitude, 
                        longitude
                  FROM destinations`;

    let whereExpressions = [];
    let queryValues = [];

    const { city, state, country } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so we can generate the right SQL

    if (city) {
      queryValues.push(`%${city}%`);
      whereExpressions.push(`city ILIKE $${queryValues.length}`);
    }

    if (state !== undefined) {
      queryValues.push(`%${state}%`);
      whereExpressions.push(`state ILIKE $${queryValues.length}`);
    }

    if (country) {
      queryValues.push(`%${country}%`);
      whereExpressions.push(`country ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results;
    query += " ORDER BY city";
    const destinationsRes = await db.query(query, queryValues);

    return destinationsRes.rows;
  }


  /** Given a destination id, return data about destination 
   * 
   * Returns { id, city, state, country, latitude, longitude } 
   * 
   * Throws NotFoundError if not found.
  */

  static async get(id) {
    const destinationRes = await db.query(
              `SELECT id, 
                      city, 
                      state, 
                      country, 
                      latitude, 
                      longitude
              FROM destinations
              WHERE id = $1`, 
              [id]);

    const destination = destinationRes.rows[0];

    if (!destination) throw new NotFoundError(`No destination" ${id}`);

    return destination;
  }

  /** Update destination data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { city, state, latitude, longitude }
   *
   * Returns { id, city, state, country, latitude, longitude }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        city: "city",
        state: "state",
        latitude: "latitude",
        longitude: "longitude"
      });

      const idVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE destinations
                        SET ${setCols}
                        WHERE id = ${idVarIdx}
                        RETURNING id,
                                  city, 
                                  state,
                                  country,
                                  latitude,
                                  longitude`;

    const result = await db.query(querySql, [...values, id]);
    const destination = result.rows[0];
                              
    if (!destination) throw new NotFoundError(`No destination: ${id}`);
                              
    return destination;
  }

  /** Delete given destination from database; returns undefined.
   *
   * Throws NotFoundError if destination not found.
   **/

   static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM destinations
           WHERE id = $1
           RETURNING id`,
        [id]);

    const destination = result.rows[0];

    if (!destination) throw new NotFoundError(`This destination does not exist: ${id}`);
  }

}

module.exports = Destination;