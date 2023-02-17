"use strict";

const request = require("supertest");
const db = require("../db.js");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testBusinessIds,
  testReviewIds,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /reviews */

describe("POST /reviews", function () {
  test("ok for logged in", async function () {
    const resp = await request(app)
        .post("/reviews")
        .send(
          {
            business_id: testBusinessIds[0], 
            business_name: "b3",
            user_id: testUserIds[1], 
            username: "u2",
            text: "text5",
            rating: 1, 
            created_on: '2022-12-01T01:51:07.802Z', 
            image_url: "http://r5.img"
          }
        )
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      review: {
          id: expect.any(Number),
          business_id: expect.any(Number), 
          business_name: "b3",
          user_id: expect.any(Number), 
          username: "u2",
          text: "text5", 
          rating: "1", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://r5.img"
      }
    });
  });


  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/reviews")
        .send({
          business_id: testBusinessIds[0], 
          business_name: "b3",
          user_id: testUserIds[1], 
          username: "u2",
          text: "text5",
          rating: 1, 
          created_on: '2022-12-01T01:51:07.802Z', 
          image_url: "http://r5.img"
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/reviews")
        .send({
          business_id: testBusinessIds[0], 
          business_name: "b1",
          user_id: testUserIds[0], 
          username: "u1",
          rating: 1, 
          created_on: '2022-12-01T01:51:07.802Z', 
          image_url: "http://r1.img"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/reviews")
        .send({
          business_id: testBusinessIds[0], 
          business_name: "b1",
          user_id: testUserIds[0], 
          username: "u1",
          text: 44, 
          rating: 1, 
          created_on: '2022-12-01T01:51:07.802Z', 
          image_url: "http://r1.img"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /reviews */

describe("GET /reviews", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get("/reviews")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      reviews: [
        { 
          id: expect.any(Number),
          business_id: testBusinessIds[0], 
          business_name: "b1",
          user_id: testUserIds[0], 
          username: "u1",
          text: "text1", 
          rating: "1", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://r1.img"
        },
        { 
          id: expect.any(Number),
          business_id: testBusinessIds[1], 
          business_name: "b2",
          user_id: testUserIds[1], 
          username: "u2",
          text: "text2", 
          rating: "2", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://r2.img"
        },
        { 
          id: expect.any(Number),
          business_id: testBusinessIds[2], 
          business_name: "b3",
          user_id: testUserIds[2], 
          username: "u3",
          text: "text3", 
          rating: "3", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://r3.img"
        },
        { 
          id: expect.any(Number),
          business_id: testBusinessIds[2], 
          business_name: "b3",
          user_id: testUserIds[0], 
          username: "u1",
          text: "text4", 
          rating: "4", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://r4.img"
        }
      ]});
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/reviews");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE reviews CASCADE");
    const resp = await request(app)
        .get("/reviews")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /reviews/review_id */

describe("GET /reviews/review_id", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get(`/reviews/${testReviewIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      review: { 
          id: expect.any(Number),
          business_id: testBusinessIds[0], 
          business_name: "b1",
          user_id: testUserIds[0], 
          username: "u1",
          text: "text1", 
          rating: "1", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://r1.img"
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/reviews/${testReviewIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if review not found", async function () {
    const resp = await request(app)
        .get(`/reviews/9999`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /reviews/review_id  */

describe("PATCH /reviews/review_id ", () => {
  test("works for same user or admin", async function () {
    const resp = await request(app)
        .patch(`/reviews/${testReviewIds[0]}`)
        .send({
          text: "New Text", 
          rating: 1, 
          image_url: "http://new.img"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      review: {
          id: expect.any(Number),
          business_id: expect.any(Number), 
          business_name: "b1",
          user_id: testUserIds[0], 
          username: "u1",
          text: "New Text", 
          rating: "1", 
          created_on: "2022-12-01T06:51:07.802Z", 
          image_url: "http://new.img"
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/reviews/${testReviewIds[0]}`)
        .send({
          text: "New Text", 
          rating: 1, 
          image_url: "http://new.img"
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such review", async function () {
    const resp = await request(app)
        .patch(`/reviews/9999`)
        .send({
          text: "New Text", 
          rating: 1, 
          image_url: "http://new.img"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/reviews/${testReviewIds[0]}`)
        .send({
          text: "New Text", 
          rating: "New",
          image_url: "http://new.img"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /reviews/review_id */

describe("DELETE /reviews/review_id", function () {
  test("works for same user or admin", async function () {
    const resp = await request(app)
        .delete(`/reviews/${testReviewIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(String) });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/reviews/${testReviewIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if review missing", async function () {
    const resp = await request(app)
        .delete(`/reviews/999`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

















      
