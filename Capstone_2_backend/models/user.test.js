"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../ExpressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
          id: testUserIds[0],
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "u1@email.com",
          bio: "U1Bio",
          isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    first_name: "Test",
    last_name: "Tester",
    email: "test@test.com",
    bio: "testBio",
    is_admin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual({ id: expect.any(Number),
                            username: "new",
                            firstName: "Test",
                            lastName: "Tester",
                            email: "test@test.com",
                            bio: "testBio",
                            isAdmin: false,
                             });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      is_admin: true,
    });
    expect(user).toEqual({  id: expect.any(Number),
                            username: "new",
                            firstName: "Test",
                            lastName: "Tester",
                            email: "test@test.com",
                            bio: "testBio",
                            isAdmin: true, });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
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
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get(testUserIds[0]);
    expect(user).toEqual({
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
          created_on: expect.any(Date),
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
          created_on: expect.any(Date),
          id: expect.any(Number),
          image_url: "http://r4.img",
          rating: "4",
          text: "text4",
          user_id: expect.any(Number),
          username: "u1"
        }
            ],
      tripcards: [
        {
          city: "d1City",
          country: "d1Country",
          created_on: expect.any(Date),
          destination_id: expect.any(Number),
          has_visited: false,
          id: expect.any(Number),
          keep_private: false,
          state: "d1State",
          user_id: expect.any(Number),
          username: "u1"
        }]      
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    username: "u1",
    firstName: "NewF",
    lastName: "NewF",
    email: "new@email.com",
    bio: "newBio",
    isAdmin: true,
  };

  test("works", async function () {
    let user = await User.update(testUserIds[0], updateData);
    expect(user).toEqual({
      id: testUserIds[0],
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let user = await User.update(testUserIds[0], {
      password: "new",
    });
    expect(user).toEqual({
      id: testUserIds[0],
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      bio: "U1Bio",
      isAdmin: false,
    });
    const found = await db.query(`SELECT * FROM users WHERE id = ${testUserIds[0]}`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update(9999, {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update(testUserIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove(testUserIds[0]);
    const res = await db.query(
        `SELECT * FROM users WHERE id=${testUserIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

