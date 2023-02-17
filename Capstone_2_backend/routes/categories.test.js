"use strict";

const db = require("../db.js");
const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testCategoryIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /categories */

describe("POST /categories", function () {
  const newCategory = {
   category_name : "NewCategory"
  };

  test("ok for loggedin", async function () {
    const resp = await request(app)
        .post("/categories")
        .send(newCategory)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      category: {
        category_name: "NewCategory",
        id: expect.any(Number)
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/categories")
        .send(newCategory);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/categories")
        .send({
          category_name: 23
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/categories")
        .send({
          category_name: 33
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /categories */

describe("GET /categories", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get("/categories")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      categories: [
        {
          id: expect.any(Number),
          category_name: 'c1Category'
         },
         {
           id: expect.any(Number),
           category_name: 'c2Category'
         },
         {
           id: expect.any(Number),
           category_name: 'c3Category'
         },
      ]});
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/categories");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE categories CASCADE");
    const resp = await request(app)
        .get("/categories")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /categories/category_id */

describe("GET /categories/category_id", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get(`/categories/${testCategoryIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
        category: {
          category_name : "c1Category",
          id: expect.any(Number),
        }
      });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/categories/${testCategoryIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if category not found", async function () {
    const resp = await request(app)
        .get(`/categories/999999`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /categories/category_id  */

describe("PATCH /categories/category_id ", () => {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/categories/${testCategoryIds[0]}`)
        .send({
          category_name: "New"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      category: {
        category_name: "New",
        id: expect.any(Number)
      }
    });
  });

  test("unauth if not admin", async function () {
    const resp = await request(app)
        .patch(`/categories/${testCategoryIds[0]}`)
        .send({
          category_name: "New"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });


  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/categories/${testCategoryIds[0]}`)
        .send({
          category_name: "New"
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such category", async function () {
    const resp = await request(app)
        .patch(`/categories/999999`)
        .send({
          category_name: "Nope"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/categories/${testCategoryIds[0]}`)
        .send({
          category_name: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /categories/category_id */

describe("DELETE /categories/category_id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/categories/${testCategoryIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(String) });
  });

  test("unauth if not admin", async function () {
    const resp = await request(app)
        .delete(`/categories/${testCategoryIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/categories/${testCategoryIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if category missing", async function () {
    const resp = await request(app)
        .delete(`/categories/9999`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

















      
