"use strict";

const db = require("../db");
const { NotFoundError } = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for categories. */

class Category {
  /** Create a category (from data), update db, return new category data.
   *
   * data should be { category_name }
   *
   * Returns { id, category_name }
   *
   * Throws BadRequestError if category already in database.
   * */

   static async create({ category_name }) {
    
    const result = await db.query(
          `INSERT INTO categories (category_name)
           VALUES ($1)
           RETURNING id, category_name`,
          [category_name],
    );
    const category = result.rows[0];

    return category;
  }

  /** Find all categories (optional filter on searchFilters)
   * 
   * searchFilter (optional)
   * - category_name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, category_name }, ...]
   * */

  static async findAll(searchFilter = {}) {
    let query = `SELECT id, category_name
                 FROM categories`;

    let whereExpressions = [];
    let queryValues = [];

    const { category_name } = searchFilter;

    if(category_name) {
      queryValues.push(`%${category_name}%`);
      whereExpressions.push(`category_name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY category_name";

    const categoriesRes = await db.query(query, queryValues);
    
    return categoriesRes.rows;
  }


  /** Given a category_id, return data about category.
   *
   * Returns { id, category_name}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const categoryRes = await db.query(
          `SELECT id,
                  category_name
           FROM categories
           WHERE id = $1`, [id]);

    const category = categoryRes.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);

    return category;
  }

  /** Update category data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {category_name}
   *
   * Returns {id, category_name}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          categoryName: "category_name",
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE categories 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                category_name
                                `;
    const result = await db.query(querySql, [...values, id]);
    const category = result.rows[0];

    if (!category) throw new NotFoundError(`No category: ${id}`);

    return category;
  }

  /** Delete given category from database; returns undefined.
   *
   * Throws NotFoundError if category not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM categories
           WHERE id = $1
           RETURNING id`,
        [id]);
    const category = result.rows[0];

    if (!category) throw new NotFoundError(`This category does not exist: ${id}`);
  }
}


module.exports = Category;


