"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: creates non-admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          first_name: "First-new",
          last_name: "Last-newL",
          password: "password-new",
          email: "new@email.com",
          bio: "bio",
          is_admin: false,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
        bio: "bio",
        isAdmin: false,
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          first_name: "First-new",
          last_name: "Last-newL",
          password: "password-new",
          email: "new@email.com",
          bio: "bio",
          is_admin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
        bio: "bio",
        isAdmin: true,
      }, token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          first_name: "First-new",
          last_name: "Last-newL",
          password: "password-new",
          email: "new@email.com",
          bio: "bio",
          is_admin: true,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          first_name: "First-new",
          last_name: "Last-newL",
          password: "password-new",
          email: "new@email.com",
          bio: "bio",
          is_admin: true,
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "not-an-email",
          bio: "bio",
          is_admin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      users: [
        {
          id: testUserIds[0],
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "u1@email.com",
          bio: "U1Bio",
          isAdmin: false,
        },
        {
          id: testUserIds[1],
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email: "u2@email.com",
          bio: "U2Bio",
          isAdmin: false,
        },
        {
          id: testUserIds[2],
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email: "u3@email.com",
          bio: "U3Bio",
          isAdmin: false,
        },
      ],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:user_id */

describe("GET /users/:user_id", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get(`/users/${testUserIds[0]}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        bio: "U1Bio",
        isAdmin: false,
        reviews: [
           {
              business_id: expect.any(Number),
              business_name: "b1",
              created_on: "2022-12-01T06:51:07.802Z",
              id: expect.any(Number),
              image_url: "http://r1.img",
              rating: "1",
              text: "text1",
              user_id: expect.any(Number),
              username: "u1",
            },
            {
              business_id: expect.any(Number),
              business_name: "b3",
              created_on: "2022-12-01T06:51:07.802Z",
              id: expect.any(Number),
              image_url: "http://r4.img",
              rating: "4",
              text: "text4",
              user_id: expect.any(Number),
              username: "u1",
            }
          ],
          tripcards: [
            {
              city: "d1City",
              country: "d1Country",
              created_on: "2022-12-01T06:51:07.802Z",
              destination_id: expect.any(Number),
              has_visited: false,
              id: expect.any(Number),
              keep_private: false,
              state: "d1State",
              user_id: expect.any(Number),
              username: "u1",
            }
          ]
      }
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .get(`/users/${testUserIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        bio: "U1Bio",
        isAdmin: false,
        reviews: [
           {
              business_id: expect.any(Number),
              business_name: "b1",
              created_on: "2022-12-01T06:51:07.802Z",
              id: expect.any(Number),
              image_url: "http://r1.img",
              rating: "1",
              text: "text1",
              user_id: expect.any(Number),
              username: "u1",
            },
            {
              business_id: expect.any(Number),
              business_name: "b3",
              created_on: "2022-12-01T06:51:07.802Z",
              id: expect.any(Number),
              image_url: "http://r4.img",
              rating: "4",
              text: "text4",
              user_id: expect.any(Number),
              username: "u1",
            }
          ],
          tripcards: [
            {
              city: "d1City",
              country: "d1Country",
              created_on: "2022-12-01T06:51:07.802Z",
              destination_id: expect.any(Number),
              has_visited: false,
              id: expect.any(Number),
              keep_private: false,
              state: "d1State",
              user_id: expect.any(Number),
              username: "u1",
            }
          ]
       },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/${testUserIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
        .get(`/users/33`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:user_id", () => {
  test("works for same user or admin", async function () {
    const resp = await request(app)
        .patch(`/users/${testUserIds[0]}`)
        .send({
          first_name: "New",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "u1@email.com",
        bio: "U1Bio",
        isAdmin: false
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/users/${testUserIds[0]}`)
        .send({
          first_name: "New",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .patch(`/users/9999`)
        .send({
          first_name: "Nope",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/${testUserIds[0]}`)
        .send({
          first_name: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
        .patch(`/users/${testUserIds[0]}`)
        .send({
          password: "new-password",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        bio: "U1Bio",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:user_id */

describe("DELETE /users/:user_id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/users/${testUserIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(String) });
  });

  test("works for same user or admin", async function () {
    const resp = await request(app)
        .delete(`/users/${testUserIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(String) });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/${testUserIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/users/33`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(404);
  });
});

