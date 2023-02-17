"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../ExpressError");
const Destination = require("./destination.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testDestinationIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newDestination = {
                    city: "New City",
                    state: "New State",
                    country: "New Country",
                    latitude: "400000",
                    longitude: "400000",
              };

  test("works", async function () {
    let destination = await Destination.create(newDestination);
    expect(destination).toEqual({
      ...newDestination,
      id: expect.any(Number),
    });
  });
    
  test("bad request with dupe", async function () {
    try {
      await Destination.create(newDestination);
      await Destination.create(newDestination);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let destinations = await Destination.findAll();
    expect(destinations).toEqual([
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
         },
    ]);
  });

  test("works: by city", async function () {
    let destinations = await Destination.findAll({ city: "d2City" });
    expect(destinations).toEqual([
            {
              id: testDestinationIds[1],
              city: "d2City",
              state: "d2State",
              country: "d2Country",
              latitude: "200000",
              longitude: "200000",
            }
          ]);
  });

  test("works: by country", async function () {
    let destinations = await Destination.findAll({ country: "d2Country" });
    expect(destinations).toEqual([
        {
          id: testDestinationIds[1],
          city: "d2City",
          state: "d2State",
          country: "d2Country",
          latitude: "200000",
          longitude: "200000",
      }
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let destinations = await Destination.findAll({ country: "nope" });
    expect(destinations).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let destination = await Destination.get(testDestinationIds[1]);
    expect(destination).toEqual({
                id: testDestinationIds[1],
                city: "d2City",
                state: "d2State",
                country: "d2Country",
                latitude: "200000",
                longitude: "200000",
            });
        });

  test("not found if no such destination", async function () {
    try {
      await Destination.get(999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
        city: "New City",
        state: "New State",
        country: "d2Country",
        latitude: "400000",
        longitude: "400000"
  };

  test("works", async function () {
    let destination = await Destination.update(testDestinationIds[1], updateData);
    expect(destination).toEqual({
      id: testDestinationIds[1],
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, 
                  city, 
                  state, 
                  country, 
                  latitude, 
                  longitude 
            FROM destinations
            WHERE id = ${testDestinationIds[1]}`);
    expect(result.rows).toEqual([{
        id: testDestinationIds[1],
        city: "New City",
        state: "New State",
        country: "d2Country",
        latitude: "400000",
        longitude: "400000"
    }]);
  });


  test("works: null fields", async function () {
    const updateDataSetNulls = {
      city: "New City",
      state: null,
      country: "New Country",
      latitude: null,
      longitude: null
    };

    let destination = await Destination.update(testDestinationIds[1], updateDataSetNulls);
    expect(destination).toEqual({
      id: testDestinationIds[1],
      ...updateDataSetNulls
    });

    const result = await db.query(
          `SELECT id, 
                  city, 
                  state, 
                  country, 
                  latitude, 
                  longitude 
          FROM destinations
          WHERE id = ${testDestinationIds[1]}`);
    
    expect(result.rows).toEqual([{
          id: testDestinationIds[1],
          city: "New City",
          state: null,
          country: "New Country",
          latitude: null,
          longitude: null
    }]);
  });

  test("not found if no such destination", async function () {
    try {
      await Destination.update(999999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError ).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Destination.update(testDestinationIds[1], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Destination.remove(testDestinationIds[1]);
    const res = await db.query(
        `SELECT id FROM destinations WHERE id=${testDestinationIds[1]}`);
    expect(res.rows.length).toEqual(0);
  });


  test("not found if no such destination", async function () {
    try {
      await Destination.remove(9999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
