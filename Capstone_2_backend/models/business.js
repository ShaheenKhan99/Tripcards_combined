"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for businesses. */

class Business {
  /** Create a business (from data), update db, return new business data.
   *
   * data should be { yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id }
   *
   * Returns { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, image_url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id }
   *
   * Throws BadRequestError if business already in database.
   * */

  static async create({ yelp_id,
                        business_name, 
                        address1, 
                        address2,
                        city, 
                        state, 
                        country, 
                        zip_code, 
                        latitude, 
                        longitude, 
                        phone, 
                        url, 
                        image_url,
                        rating, 
                        yelpReview_count,
                        sub_category,
                        category_name,
                        category_id, 
                        destination_id }) {

    const duplicateCheck = await db.query(
          `SELECT yelp_id, business_name 
           FROM businesses
           WHERE yelp_id = $1 and business_name = $2`,
        [yelp_id, business_name]);


    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate business: ${business_name}`);

    const result = await db.query(
          `INSERT INTO businesses ( yelp_id,
                                    business_name, 
                                    address1, 
                                    address2,
                                    city, 
                                    state, 
                                    country, 
                                    zip_code, 
                                    latitude, 
                                    longitude, 
                                    phone, 
                                    url, 
                                    image_url,
                                    rating, 
                                    yelpreview_count,
                                    sub_category,
                                    category_name,
                                    category_id, 
                                    destination_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
           RETURNING id, 
                      yelp_id,
                      business_name, 
                      address1, 
                      address2, 
                      city, 
                      state, 
                      country, 
                      zip_code, 
                      latitude, 
                      longitude, 
                      phone, 
                      url, 
                      image_url,
                      rating, 
                      yelpreview_count AS "yelpReview_count",
                      sub_category,
                      category_name,
                      category_id, 
                      destination_id`,
        [
          yelp_id,
          business_name, 
          address1, 
          address2,  
          city, 
          state, 
          country, 
          zip_code, 
          latitude, 
          longitude, 
          phone, 
          url, 
          image_url,
          rating, 
          yelpReview_count,
          sub_category,
          category_name,
          category_id, 
          destination_id
        ]
    );
    const business = result.rows[0];

    return business;
  }


  /** Find all businesses (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - yelp_id
   * - destination_id
   * - category_id
   * - category_name
   * - rating
   * - zip_code
   * - city
   * - business_name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, category_name, category_id, destination_id }, ...]
   * */

  static async findAll(searchFilters = {}, orderBy = {}) {
    let query = `SELECT id, 
                        yelp_id,
                        business_name, 
                        address1, 
                        address2,
                        city, 
                        state, 
                        country, 
                        zip_code, 
                        latitude, 
                        longitude, 
                        phone, 
                        url, 
                        image_url,
                        rating, 
                        yelpreview_count AS "yelpReview_count",
                        sub_category,
                        category_name,
                        category_id, 
                        destination_id
                 FROM businesses`;
                 
    let whereExpressions = [];
    let queryValues = [];

    const { yelp_id, destination_id, category_id, business_name, zip_code, city, rating, category_name } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so we can generate the right SQL

    if (yelp_id !== undefined) {
      queryValues.push(yelp_id);
      whereExpressions.push(`yelp_id = $${queryValues.length}`);
    }

    if(destination_id !== undefined) {
      queryValues.push(destination_id);
      whereExpressions.push(`destination_id = $${queryValues.length}`);
    }

    if(category_id !== undefined) {
      queryValues.push(category_id);
      whereExpressions.push(`category_id = $${queryValues.length}`);
    }

    if (category_name !== undefined) {
      queryValues.push(`%${category_name}%`);
      whereExpressions.push(`category_name ILIKE $${queryValues.length}`);
    }

    if (rating !== undefined) {
      queryValues.push(rating);
      whereExpressions.push(`rating >= $${queryValues.length}`);
    }

    if (zip_code !== undefined) {
      queryValues.push(zip_code);
      whereExpressions.push(`zip_code ILIKE $${queryValues.length}`);
    }

    if (city) {
      queryValues.push(`%${city}%`);
      whereExpressions.push(`city ILIKE $${queryValues.length}`);
    }

    if (business_name) {
      queryValues.push(`%${business_name}%`);
      whereExpressions.push(`business_name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY city";
    const businessesRes = await db.query(query, queryValues);
    return businessesRes.rows;
  }

  /** Given a business id, return data about business.
   *
   * Returns { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id, reviews }
   * 
   * where reviews is [{ id, user_id, username, business_id, business_name, text, rating, created_on, image_url }, ...]
   * 
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const businessRes = await db.query(
          `SELECT id, 
                  yelp_id,
                  business_name, 
                  address1, 
                  address2,
                  city, 
                  state, 
                  country, 
                  zip_code, 
                  latitude, 
                  longitude, 
                  phone, 
                  url, 
                  image_url,
                  rating, 
                  yelpreview_count AS "yelpReview_count",
                  sub_category,
                  category_name,
                  category_id, 
                  destination_id
          FROM businesses
          WHERE id = $1`,
        [id]);

    const business = businessRes.rows[0];

    if (!business) throw new NotFoundError(`No business: ${id}`);

    const reviewsRes = await db.query(
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
          WHERE r.business_id = $1
          ORDER BY id`,
          [id]
    );

    business.reviews = reviewsRes.rows;

    return business;

  }


  /** Update business data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {business_name, address1, address2, zip_code, latitude, longitude, phone, url, rating, yelpReview_count, sub_category, category_name}
   *
   * Returns { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, category_name, category_id, destination_id }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          business_name: "business_name",
          address1: "address1",
          address2: "address2",
          zip_code: "zip_code",
          latitude: "latitude",
          longitude: "longitude",
          phone: "phone",
          url: "url",
          image_url: "image_url",
          rating: "rating",
          yelpReview_count: "yelpreview_count",
          sub_category: "sub_category",
          category_name: "category_name",
          category_id: "category_id"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE businesses
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                yelp_id,
                                business_name, 
                                address1, 
                                address2,
                                city, 
                                state, 
                                country, 
                                zip_code, 
                                latitude, 
                                longitude, 
                                phone, 
                                url, 
                                image_url,
                                rating, 
                                yelpreview_count AS "yelpReview_count",
                                sub_category,
                                category_name,
                                category_id, 
                                destination_id`;


    const result = await db.query(querySql, [...values, id]);
    const business = result.rows[0];

    if (!business) throw new NotFoundError(`No business: ${id}`);

    return business;
  }



  /** Delete given business from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM businesses
           WHERE id = $1
           RETURNING id`,
        [id]);
    const business = result.rows[0];

    if (!business) throw new NotFoundError(`This business does not exist : ${id}`);
  }
}


module.exports = Business;