"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../ExpressError");
const Category = require("./category.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testCategoryIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCategory = {
    category_name: 'newCategory'
  };

  test("works", async function () {
    let category = await Category.create(newCategory);
    expect(category).toEqual({
                              id: expect.any(Number),
                              category_name: 'newCategory'
                            });
  });

  test("bad request with dupe", async function () {
    try {
      await Category.create(newCategory);
      await Category.create(newCategory);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let categories = await Category.findAll();
    expect(categories).toEqual([
      {
       id: testCategoryIds[0],
       category_name: 'c1Category'
      },
      {
        id: testCategoryIds[1],
        category_name: 'c2Category'
      },
      {
        id: testCategoryIds[2],
        category_name: 'c3Category'
      },
    ]);
  });

  test("works: by category_name", async function () {
    let categories = await Category.findAll({ category_name: 'c2Category' });
    expect(categories).toEqual([
      {
        id: testCategoryIds[1],
        category_name: 'c2Category'
      }
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let categories = await Category.findAll({ category_name: "nope" });
    expect(categories).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let category = await Category.get(testCategoryIds[0]);
    expect(category).toEqual({
     id: testCategoryIds[0],
     category_name: 'c1Category'
    });
  });

  test("not found if no such category", async function () {
    try {
      await Category.get(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    category_name: "New"
  };

  test("works", async function () {
    let category = await Category.update(testCategoryIds[0], updateData);
    expect(category).toEqual({
      id: testCategoryIds[0],
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, category_name
           FROM categories
           WHERE id=${testCategoryIds[0]}`);
    expect(result.rows).toEqual([{
      id: testCategoryIds[0],
     category_name: 'New'
    }]);
  });

  test("not found if no such category", async function () {
    try {
      await Category.update(99999, updateData);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Category.update(testCategoryIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Category.remove(testCategoryIds[0]);
    const res = await db.query(
        `SELECT id FROM categories WHERE id=${testCategoryIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such category", async function () {
    try {
      await Category.remove(9999999);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});