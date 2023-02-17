"use strict";

const db = require("../db.js");
const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testDestinationIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /destination */

describe("POST /destinations", function () {
  const newDestination = {
    city: "New City",
    state: "New State",
    country: "New Country",
    latitude: 400000,
    longitude: 400000
  };

  test("ok for loggedin", async function () {
    const resp = await request(app)
        .post("/destinations")
        .send(newDestination)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      destination: {
          id: expect.any(Number),
          city: "New City",
          state: "New State",
          country: "New Country",
          latitude: "400000",
          longitude: "400000"
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/destinations")
        .send(newDestination);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/destinations")
        .send({
          city: "new"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/destinations")
        .send({
          city: "New City",
          state: "New State",
          country: false,
          latitude: 400000,
          longitude: 400000
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /destinations */

describe("GET /destinations", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get("/destinations")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      destinations: [
        {
          id: testDestinationIds[0],
          city: "d1City",
          state: "d1State",
          country: "d1Country",
          latitude: "100000",
          longitude: "100000"
        },
        {
          id: testDestinationIds[1],
          city: "d2City",
          state: "d2State",
          country: "d2Country",
          latitude: "200000",
          longitude: "200000",
        },
        {
          id: testDestinationIds[2],
          city: "d3City",
          state: "d3State",
          country: "d3Country",
          latitude: "300000",
          longitude: "300000"
       }
      ]});
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/destinations");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE destinations CASCADE");
    const resp = await request(app)
        .get("/destinations")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /destinations/:destination_id */

describe("GET /destinations/:destination_id", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get(`/destinations/${testDestinationIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      destination: {
        id: testDestinationIds[0],
        city: "d1City",
        state: "d1State",
        country: "d1Country",
        latitude: "100000",
        longitude: "100000"
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/destinations/${testDestinationIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if destination not found", async function () {
    const resp = await request(app)
        .get(`/destinations/99999`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /destinations/:destination_id */

describe("PATCH /destinations/:destination_id", () => {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/destinations/${testDestinationIds[0]}`)
        .send({
          city: "New",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      destination: {
                id: testDestinationIds[0],
                city: "New",
                state: "d1State",
                country: "d1Country",
                latitude: "100000",
                longitude: "100000"
              }
      });
    });

  test("unauth if not admin", async function () {
    const resp = await request(app)
        .patch(`/destinations/${testDestinationIds[0]}`)
        .send({
          city: "New",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });


  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/destinations/${testDestinationIds[0]}`)
        .send({
          city: "New"
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such destination", async function () {
    const resp = await request(app)
        .patch(`/destinations/99999`)
        .send({
          city: "Nope",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/destinations/${testDestinationIds[0]}`)
        .send({
          city: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /destinations/:destination_id */

describe("DELETE /destinations/:destination_id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/destinations/${testDestinationIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(String) });
  });

  test("unauth if not admin", async function () {
    const resp = await request(app)
        .delete(`/destinations/${testDestinationIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/destinations/${testDestinationIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if destination missing", async function () {
    const resp = await request(app)
        .delete(`/destinations/9999`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

















      
