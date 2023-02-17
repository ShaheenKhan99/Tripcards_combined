"use strict";

const db = require("../db.js");
const Tripcard = require("./tripcard.js");
const { BadRequestError, NotFoundError } = require("../ExpressError");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testDestinationIds,
  testBusinessIds,
  testTripcardIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** Create Tripcard */

describe("create", function () {
  let newTripcard = {
          user_id: null,
          destination_id: null,
          username: "u1",
          city: "d1City",
          state: "d1State",
          country: "d1Country",
          created_on: new Date(),
          keep_private: false,
          has_visited: false
      };

  test("works", async function () {
    let tripcard = await Tripcard.create(newTripcard);

    expect(tripcard).toEqual({
          ...newTripcard,
          id: expect.any(Number)
    });
  });

  test("bad request with dupe", async function () {
    try {
      await Tripcard.create(newTripcard);
      await Tripcard.create(newTripcard);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let tripcards = await Tripcard.findAll();
    expect(tripcards.length).toBe(4);
  });

  test("works: by city", async function () {
    let tripcards = await Tripcard.findAll({ city: "d2City" });
    expect(tripcards).toEqual([
      {
        id: testTripcardIds[1],
        user_id: testUserIds[1],
        destination_id: testDestinationIds[1],
        username: "u2",
        city: "d2City",
        state: "d2State",
        country: "d2Country",
        created_on: expect.any(Date),
        keep_private: false,
        has_visited: false
      },
    ]);
  });

  test("works: by username", async function () {
    let tripcards = await Tripcard.findAll({ username: "u2" });
    expect(tripcards).toEqual([
      {
        id: expect.any(Number),
        user_id: testUserIds[1],
        destination_id: expect.any(Number),
        username: "u2",
        city: "d2City",
        state: "d2State",
        country: "d2Country",
        created_on: expect.any(Date),
        keep_private: false,
        has_visited: false
      }
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let tripcard = await Tripcard.get(testTripcardIds[1]);
    expect(tripcard).toEqual({
        id: testTripcardIds[1],
        user_id: testUserIds[1],
        destination_id: testDestinationIds[1],
        username: "u2",
        city: "d2City",
        state: "d2State",
        country: "d2Country",
        created_on: expect.any(Date),
        keep_private: false,
        has_visited: false,
        tripcardBusinesses: [{
                    business_id: expect.any(Number),
                    id: expect.any(Number),
                    tripcard_id: expect.any(Number),
        }]
     });
  });

  test("not found if no such tripcard", async function () {
    try {
      await Tripcard.get(999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
      destination_id: testDestinationIds[1],
      user_id: testUserIds[1],
      username: "u2",
      city: "d2City",
      state: "d2State",
      country: "d2Country",
      created_on:  new Date(),
      keep_private: true,
      has_visited: true
  };

  test("works", async function () {
    let tripcard = await Tripcard.update(testTripcardIds[1], updateData);
    expect(tripcard.keep_private).toBeTruthy();
    expect(tripcard.has_visited).toBeTruthy();

    const result = await db.query(
          `SELECT id,
                  user_id,
                  destination_id, 
                  username,
                  city,
                  state,
                  country,
                  created_on,
                  keep_private,
                  has_visited 
            FROM tripcards
            WHERE id = ${testTripcardIds[1]}`);
     let updatedTripcard = result.rows[0];
     expect(updatedTripcard.keep_private).toBeTruthy();
     expect(updatedTripcard.has_visited).toBeTruthy();
  });


  test("not found if no such tripcard", async function () {
    try {
      await Tripcard.update(999999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Tripcard.update(testTripcardIds[1], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Tripcard.remove(testTripcardIds[1]);
    const res = await db.query(
        `SELECT id FROM tripcards WHERE id=${testTripcardIds[1]}`);
    expect(res.rows.length).toEqual(0);
  });


  test("not found if no such tripcard", async function () {
    try {
          await Tripcard.remove(9999999);
          fail();
        } catch (err) {
          expect(err instanceof NotFoundError).toBeTruthy();
        }
  });
});



/************************************** addBusinessToTripcard */

describe("addBusinessToTripcard", function () {
  test("works", async function () {
    let tripcardBusiness = await Tripcard.addBusinessToTripcard(testTripcardIds[0], testBusinessIds[3]);
    expect(tripcardBusiness.business_id).toEqual(testBusinessIds[3])
  });


  test("bad request with dupe", async function () {
    try {
         await Tripcard.addBusinessToTripcard(testTripcardIds[0], testBusinessIds[3]);
         await Tripcard.addBusinessToTripcard(testTripcardIds[0], testBusinessIds[3]);
          fail();
        } catch (err) {
          expect(err).toBeTruthy();
        }
    });


  test("not found if no such tripcard", async function () {
    try {
          await Tripcard.addBusinessToTripcard(testTripcardIds[8], testBusinessIds[0]);
          fail();
        } catch (err) {
           expect(err).toBeTruthy();
        }
    });


  test("not found if no such business", async function () {
    try {
          await Tripcard.addBusinessToTripcard(testTripcardIds[0], testBusinessIds[13]);
          fail();
        } catch (err) {
           expect(err).toBeTruthy();
        }
    });
  });

/************************************** getTripcardBusinesses */

describe("getTripcardBusinesses", function () {
  test("works", async function () {
    let businesses = await Tripcard.getTripcardBusinesses(testTripcardIds[0]);
    expect(businesses.length).toEqual(1);
  });


  test("empty array if no businesses added", async function () {
   let businesses = await Tripcard.getTripcardBusinesses(testTripcardIds[8]);
      expect(businesses).toEqual([]);
  });


  test("not found if no such tripcard", async function () {
    try {
          await Tripcard.getTripcardBusinesses("nope");
          fail();
        } catch (err) {
           expect(err).toBeTruthy();
        }
    });
  });



/************************************** removeBusinessFromTripcard */

describe("removeBusinessFromTripcard", function () {
  test("works", async function () {
    await Tripcard.removeBusinessFromTripcard(testTripcardIds[0], testBusinessIds[0]);
    const res = await db.query(
      `SELECT id FROM tripcardbusinesses WHERE id=${testTripcardIds[0]}`);
      expect(res.rows.length).toEqual(0);
  });


  test("not found if no such tripcard", async function () {
    try {
          await Tripcard.removeBusinessFromTripcard("nope", testBusinessIds[0]);
          fail();
        } catch (err) {
         expect(err).toBeTruthy();
        }
    });

  test("not found if no such business", async function () {
    try {
          await Tripcard.removeBusinessFromTripcard(testTripcardIds[0], "nope");
          fail();
        } catch (err) {
          expect(err).toBeTruthy();
        }
    });
});


  







  











