"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../ExpressError");
const Business = require("./business.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testCategoryIds,
  testDestinationIds,
  testBusinessIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newBusiness = {
    yelp_id: "b5",
    business_name: "New",
    address1: "New Address1",
    address2: "New Address2",
    city: "d3City",
    state: "d3State",
    country: "d3Country",
    zip_code: "NewZipcode",
    latitude: "4444444444",
    longitude: "4444444444",
    phone: "5555",
    url: "http://new.business",
    image_url: "http://new.img",
    rating: "4",
    yelpReview_count: 4,
    sub_category: "s3Subcategory",
    category_name: "c3Category",
    category_id: null,
    destination_id: null
  };

  test("works", async function () {
    let business = await Business.create(newBusiness);
    expect(business).toEqual({
      ...newBusiness,
      id: expect.any(Number),
    });
  });


  test("bad request with dupe", async function () {
    try {
      await Business.create(newBusiness);
      await Business.create(newBusiness);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let businesses = await Business.findAll();
    expect(businesses.length).toEqual(4);
  });

  test("works: by city", async function () {
    let businesses = await Business.findAll({ city: "d2City" });
    expect(businesses).toEqual([
          {
            id: testBusinessIds[1],
            yelp_id: "b2",
            business_name: "b2Name",
            address1: "b2Address1",
            address2: "b2Address2",
            city: "d2City",
            state: "d2State",
            country: "d2Country",
            zip_code: "b2Zipcode",
            latitude: "2222222222",
            longitude: "2222222222",
            phone: "2222",
            url: "http://b2.business",
            image_url: "http://b2.img",
            rating: "2",
            yelpReview_count: 2,
            sub_category: "s2Subcategory",
            category_name: "c2Category",
            category_id: testCategoryIds[1],
            destination_id: testDestinationIds[1]
          }
     ]);
  });

  test("works: by category_name", async function () {
    let businesses = await Business.findAll({ category_name: "c1Category" });
    expect(businesses).toEqual([
        {
          id: testBusinessIds[0],
          yelp_id: "b1",
          business_name: "b1Name",
          address1: "b1Address1",
          address2: "b1Address2",
          city: "d1City",
          state: "d1State",
          country: "d1Country",
          zip_code: "b1Zipcode",
          latitude: "1111111111",
          longitude: "1111111111",
          phone: "1111",
          url: "http://b1.business",
          image_url: "http://b1.img",
          rating: "1",
          yelpReview_count: 1,
          sub_category: "s1Subcategory",
          category_name: "c1Category",
          category_id: testCategoryIds[0],
          destination_id: testDestinationIds[0]
      },
      {
        id: testBusinessIds[3],
        yelp_id: "b4",
        business_name: "b4Name",
        address1: "b4Address1",
        address2: "b4Address2",
        city: "d1City",
        state: "d1State",
        country: "d1Country",
        zip_code: "b4Zipcode",
        latitude: "4444444444",
        longitude: "4444444444",
        phone: "4444",
        url: "http://b4.business",
        image_url: "http://b4.img",
        rating: "1",
        yelpReview_count: 1,
        sub_category: "s1Subcategory",
        category_name: "c1Category",
        category_id: testCategoryIds[0],
        destination_id: testDestinationIds[0]
     } 
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let businesses = await Business.findAll({ business_name: "nope" });
    expect(businesses).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let business = await Business.get(testBusinessIds[1]);
    expect(business).toEqual({
                id: testBusinessIds[1],
                yelp_id: "b2",
                business_name: "b2Name",
                address1: "b2Address1",
                address2: "b2Address2",
                city: "d2City",
                state: "d2State",
                country: "d2Country",
                zip_code: "b2Zipcode",
                latitude: "2222222222",
                longitude: "2222222222",
                phone: "2222",
                url: "http://b2.business",
                image_url: "http://b2.img",
                rating: "2",
                yelpReview_count: 2,
                sub_category: "s2Subcategory",
                category_name: "c2Category",
                category_id: testCategoryIds[1],
                destination_id: testDestinationIds[1],
                reviews:  [{
                  business_id: testBusinessIds[1],
                  business_name: "b2",
                  created_on: expect.any(Date),
                  id: expect.any(Number),
                  image_url: "http://r2.img",
                  rating: "2",
                  text: "text2",
                  user_id: expect.any(Number),
                  username: "u2"
                },
              ],
            });
        });

  test("not found if no such business", async function () {
    try {
      await Business.get(999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
        yelp_id: "b2",
        business_name: "New",
        address1: "NewAddress1",
        address2: "NewAddress2",
        city: "d2City",
        state: "d2State",
        country: "d2Country",
        zip_code: "NewZipcode",
        latitude: "2222222222",
        longitude: "2222222222",
        phone: "2222",
        url: "http://b2.business",
        image_url: "http://b2.img",
        rating: "2",
        yelpReview_count: 2,
        sub_category: "s2Subcategory",
        category_name: "c2Category",
        category_id: testCategoryIds[1],
        destination_id: testDestinationIds[1]
  };

  test("works", async function () {
    let business = await Business.update(testBusinessIds[1], updateData);
    expect(business.business_name).toEqual("New");
    expect(business.address1).toEqual("NewAddress1");
    expect(business.address2).toEqual("NewAddress2");
    expect(business.zip_code).toEqual("NewZipcode");

    const result = await db.query(
          `SELECT id, 
                  yelp_id,
                  business_name, 
                  address1, 
                  address2,
                  city, 
                  state, 
                  country, 
                  zip_code, 
                  latitude, 
                  longitude, 
                  phone, 
                  url, 
                  image_url,
                  rating, 
                  yelpreview_count AS "yelpReview_count",
                  sub_category,
                  category_name,
                  category_id, 
                  destination_id
            FROM businesses
            WHERE id = ${testBusinessIds[1]}`);
    let updatedBusiness = result.rows[0];
    expect(updatedBusiness.business_name).toEqual("New");
    expect(updatedBusiness.address1).toEqual("NewAddress1");
    expect(updatedBusiness.address2).toEqual("NewAddress2");
    expect(updatedBusiness.zip_code).toEqual("NewZipcode");
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      business_name: "New",
      address1: "New Address1",
      address2: null,
      zip_code: null,
      latitude: null,
      longitude: null,
      rating: "2",
      yelpReview_count: 2,
      sub_category: "s3Subcategory",
      category_name: "c3Category"
    };

    let business = await Business.update(testBusinessIds[2], updateDataSetNulls);
    expect(business.business_name).toEqual("New");
    expect(business.address1).toEqual("New Address1");
    expect(business.address2).toBeNull();
    expect(business.zip_code).toBeNull();
    expect(business.latitude).toBeNull();
    expect(business.longitude).toBeNull();

    const result = await db.query(
          `SELECT id, 
                  yelp_id,
                  business_name, 
                  address1, 
                  address2,
                  city, 
                  state, 
                  country, 
                  zip_code, 
                  latitude, 
                  longitude, 
                  phone, 
                  url, 
                  image_url,
                  rating, 
                  yelpreview_count AS "yelpReview_count",
                  sub_category,
                  category_name,
                  category_id, 
                  destination_id
              FROM businesses
              WHERE id = ${testBusinessIds[2]}`);
    let updatedBusiness= result.rows[0];
    expect(updatedBusiness.business_name).toEqual("New");
    expect(updatedBusiness.address1).toEqual("New Address1");
    expect(updatedBusiness.address2).toBeNull();
    expect(updatedBusiness.zip_code).toBeNull();
    expect(updatedBusiness.latitude).toBeNull();
    expect(updatedBusiness.longitude).toBeNull();
  });

  test("not found if no such business", async function () {
    try {
      await Business.update(999999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Business.update(testBusinessIds[1], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Business.remove(testBusinessIds[2]);
    const res = await db.query(
        `SELECT id FROM businesses WHERE id=${testBusinessIds[2]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such business", async function () {
    try {
      await Business.remove(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
