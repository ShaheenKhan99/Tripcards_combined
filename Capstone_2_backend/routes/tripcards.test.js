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
  testDestinationIds,
  testBusinessIds,
  testTripcardIds,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /tripcards */

describe("POST /tripcards", function () {

  test("ok for loggedin", async function () {
    const resp = await request(app)
        .post("/tripcards")
        .send({
          user_id: testUserIds[0],
          destination_id: testDestinationIds[1],
          username: 'u1',
          city: 'd2City',
          state: 'd2State',
          country: 'd2Country',
          created_on: "2022-12-01T01:51:07.802Z",
          keep_private: false,
          has_visited: false
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      tripcard: {
        id: expect.any(Number),
        user_id: testUserIds[0],
        destination_id: testDestinationIds[1],
        username: "u1",
        city: "d2City",
        state: "d2State",
        country: "d2Country",
        created_on: "2022-12-01T06:51:07.802Z",
        keep_private: false,
        has_visited: false
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/tripcards")
        .send({
          user_id: testUserIds[0],
          destination_id: testDestinationIds[1],
          username: 'u1',
          city: 'd2City',
          state: 'd2State',
          country: 'd2Country',
          created_on: "2022-12-01T01:51:07.802Z",
          keep_private: false,
          has_visited: false
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/tripcards")
        .send({
          user_id: testUserIds[0],
          state: "d2State",
          created_on: "2022-12-01T01:51:07.802Z",
          keep_private: false,
          has_visited: false
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/tripcards")
        .send({
          user_id: testUserIds[0],
          destination_id: null,
          username: "u1",
          city: 23,
          state: "d2State",
          country: "d2Country",
          created_on: "2022-12-01T01:51:07.802Z",
          keep_private: false,
          has_visited: false
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /tripcards */

describe("GET /tripcards", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get("/tripcards")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      tripcards: [
        {
          id: expect.any(Number),
          user_id: expect.any(Number),
          destination_id:expect.any(Number),
          username: "u1",
          city: "d1City",
          state: "d1State",
          country: "d1Country",
          created_on: "2022-12-01T06:51:07.802Z",
          keep_private: false,
          has_visited: false
        },
        {
          id: expect.any(Number),
          user_id: expect.any(Number),
          destination_id: expect.any(Number),
          username: "u3",
          city: "d1City",
          state: "d1State",
          country: "d1Country",
          created_on: "2022-12-01T06:51:07.802Z",
          keep_private: false,
          has_visited: false
        },
        {
          id: expect.any(Number),
          user_id: expect.any(Number),
          destination_id: expect.any(Number),
          username: "u2",
          city: "d2City",
          state: "d2State",
          country: "d2Country",
          created_on: "2022-12-01T06:51:07.802Z",
          keep_private: false,
          has_visited: false
        },
        {
          id: expect.any(Number),
          user_id: expect.any(Number),
          destination_id: expect.any(Number),
          username: "u3",
          city: "d3City",
          state: "d3State",
          country: "d3Country",
          created_on: "2022-12-01T06:51:07.802Z",
          keep_private: false,
          has_visited: false
        },
        
      ]});
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/tripcards");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE tripcards CASCADE");
    const resp = await request(app)
        .get("/tripcards")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /tripcards/tripcard_id */

describe("GET /tripcards/tripcard_id", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get(`/tripcards/${testTripcardIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      tripcard : {
        id: testTripcardIds[0],
        user_id: testUserIds[0],
        destination_id: testDestinationIds[0],
        username: "u1",
        city: "d1City",
        state: "d1State",
        country: "d1Country",
        created_on: "2022-12-01T06:51:07.802Z",
        keep_private: false,
        has_visited: false,
        tripcardBusinesses: [
          {
            business_id: expect.any(Number),
            id: expect.any(Number),
            tripcard_id: expect.any(Number),
          }
        ]
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/tripcards/${testTripcardIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if tripcard not found", async function () {
    const resp = await request(app)
        .get(`/tripcards/99999`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /tripcards/tripcard_id  */

describe("PATCH /tripcards/tripcard_id", () => {
  test("works for same user or admin", async function () {
    const resp = await request(app)
        .patch(`/tripcards/${testTripcardIds[0]} `)
        .send({
          keep_private: true,
          has_visited: true
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      tripcard: {
          id: testTripcardIds[0],
          user_id: testUserIds[0],
          destination_id: testDestinationIds[0],
          username: "u1",
          city: "d1City",
          state: "d1State",
          country: "d1Country",
          created_on: "2022-12-01T06:51:07.802Z",
          keep_private: true,
          has_visited: true
        }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/tripcards/${testTripcardIds[0]}`)
        .send({
          keep_private: true,
          has_visited: true
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such tripcard", async function () {
    const resp = await request(app)
        .patch(`/tripcards/9999`)
        .send({
          keep_private: true,
          has_visited: true
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/tripcards/${testTripcardIds[0]}`)
        .send({
          keep_private: null,
          has_visited: true
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /tripcards/tripcard_id */

describe("DELETE /tripcards/tripcard_id", function () {
  test("works for same user or admin", async function () {
    const resp = await request(app)
        .delete(`/tripcards/${testTripcardIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(String) });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/tripcards/${testTripcardIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if tripcard missing", async function () {
    const resp = await request(app)
        .delete(`/tripcards/9999`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/*************************************POST /tripcards/:id/add/:business_id */

describe("POST /tripcards/:id/add/business_id", function () {
    test("works for same user or admin", async function () {
      const resp = await request(app)
          .post(`/tripcards/${testTripcardIds[0]}/add/${testBusinessIds[3]}`)
          .set("authorization", `Bearer ${adminToken}`);
          expect(resp.statusCode).toEqual(201);
          expect(resp.body).toEqual({
            tripcardBusiness: { 
                                tripcard_id: testTripcardIds[0],
                                business_id: testBusinessIds[3]
                              }
          });
    });

  test("unauth for anon", async function () {
    const resp = await request(app)
          .post(`/tripcards/${testTripcardIds[0]}/add/${testBusinessIds[0]}`)
      expect(resp.statusCode).toEqual(401);
    });
});

/***********************************DELETE /tripcards/:id/delete/:business_id */

describe("DELETE /tripcards/:id/delete/business_id", function () {
  test("works for same user or admin", async function () {
    const resp = await request(app)
        .delete(`/tripcards/${testTripcardIds[0]}/delete/${testBusinessIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({ message: "Business removed from tripcard" });
  });

test("unauth for anon", async function () {
  const resp = await request(app)
    .delete(`/tripcards/${testTripcardIds[0]}/delete/${testBusinessIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });
});




 


















      
