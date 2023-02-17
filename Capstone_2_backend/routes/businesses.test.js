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
  testDestinationIds,
  testBusinessIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /businesses */

describe("POST /businesses", function () {
  const newBusiness = {
    yelp_id: "5",
    business_name: "New",
    address1: "New Address1",
    address2: "New Address2",
    city: "d3City",
    state: "d3State",
    country: "d3Country",
    zip_code: "NewZipcode",
    latitude: 3333333333,
    longitude: 3333333333,
    phone: "5555",
    url: "http://new.business",
    image_url: "http://new.img",
    rating: 4,
    yelpReview_count: 4,
    sub_category: "s3Subcategory",
    category_name: "c3Category",
    category_id: testCategoryIds[2],
    destination_id: testDestinationIds[2]
  };


  test("ok for loggedin", async function () {
    const resp = await request(app)
        .post("/businesses")
        .send(newBusiness)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      business: {
          id: expect.any(Number),
          yelp_id: "5",
          business_name: "New",
          address1: "New Address1",
          address2: "New Address2",
          city: "d3City",
          state: "d3State",
          country: "d3Country",
          zip_code: "NewZipcode",
          latitude: "3333333333",
          longitude: "3333333333",
          phone: "5555",
          url: "http://new.business",
          image_url: "http://new.img",
          rating: "4",
          yelpReview_count: 4,
          sub_category: "s3Subcategory",
          category_name: "c3Category",
          category_id: null,
          destination_id: null
        }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/businesses")
        .send(newBusiness);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/businesses")
        .send({
          newBusiness : {
            yelp_id: "5",
            address2: "New Address2",
            city: "d3City",
            state: "d3State",
            country: "d3Country",
            zip_code: "NewZipcode",
            latitude: 3333333333,
            longitude: 3333333333,
            phone: "5555",
            url: "http://new.business",
            image_url: "http://new.img",
            rating: 4,
            yelpReview_count: 4,
            sub_category: "s3Subcategory",
            category_name: "c3Category",
            category_id: testCategoryIds[2],
            destination_id: testDestinationIds[2]
          }
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/businesses")
        .send({
          newBusiness : {
            yelp_id: "5",
            business_name: "New",
            address1: 22,
            address2: "New Address2",
            city: 666,
            state: "d3State",
            country: "d3Country",
            zip_code: "NewZipcode",
            latitude: 3333333333,
            longitude: 3333333333,
            phone: "5555",
            url: "http://new.business",
            image_url: "http://new.img",
            rating: 4,
            yelpReview_count: 4,
            sub_category: "s3Subcategory",
            category_name: "c3Category",
            category_id: testCategoryIds[2],
            destination_id: testDestinationIds[2]
          }
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /businesses */

describe("GET /businesses", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get("/businesses")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      businesses: [
        {
          id: expect.any(Number),
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
          category_id: expect.any(Number),
          destination_id: expect.any(Number)
      },
      {   
        id: expect.any(Number),
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
        category_id: expect.any(Number),
        destination_id: expect.any(Number),
      },
      {
          id: expect.any(Number),
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
          category_id: expect.any(Number),
          destination_id: expect.any(Number)
      },
      {
          id: expect.any(Number),
          yelp_id: "b3",
          business_name: "b3Name",
          address1: "b3Address1",
          address2: "b3Address2",
          city: "d3City",
          state: "d3State",
          country: "d3Country",
          zip_code: "b3Zipcode",
          latitude: "3333333333",
          longitude: "3333333333",
          phone: "3333",
          url: "http://b3.business",
          image_url: "http://b3.img",
          rating: "3",
          yelpReview_count: 3,
          sub_category: "s3Subcategory",
          category_name: "c3Category",
          category_id: expect.any(Number),
          destination_id: expect.any(Number)
     },
    ]}); 
  }); 


  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/businesses");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE businesses CASCADE");
    const resp = await request(app)
        .get("/businesses")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /businesses/business_id */

describe("GET /businesses/business_id", function () {
  test("works for loggedin", async function () {
    const resp = await request(app)
        .get(`/businesses/${testBusinessIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      business : {
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
        destination_id: expect.any(Number),
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
         ]
        }
      });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/businesses/${testBusinessIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if business not found", async function () {
    const resp = await request(app)
        .get(`/businesses/9999`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /businesses/business_id */

describe("PATCH /businesses/business_id", () => {
  test("works for admin", async function () {
    const resp = await request(app)
        .patch(`/businesses/${testBusinessIds[0]}`)
        .send({
          phone: "New phone",
          url: "http://new.business",
          image_url: "http://new.img",
          rating: 2
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      business: {
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
          phone: "New phone",
          url: "http://new.business",
          image_url: "http://new.img",
          rating: "2",
          yelpReview_count: 1,
          sub_category: "s1Subcategory",
          category_name: "c1Category",
          category_id: testCategoryIds[0],
          destination_id: testDestinationIds[0]
        }
    });
  });

  test("unauth if not admin", async function () {
    const resp = await request(app)
        .patch(`/businesses/${testBusinessIds[0]}`)
        .send({
          phone: "New phone",
          url: "http://new.business",
          image_url: "http://new.img",
          rating: 2
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/businesses/${testBusinessIds[0]}`)
        .send({
          phone: "New phone",
          url: "http://new.business",
          image_url: "http://new.img",
          rating: 2
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such business", async function () {
    const resp = await request(app)
        .patch(`/businesses/9999`)
        .send({
          phone: "New phone",
          url: "http://new.business",
          image_url: "http://new.img",
          rating: 2
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/businesses/${testBusinessIds[0]}`)
        .send({
          phone: "New phone",
          url: 23,
          image_url: "http://new.img",
          rating: "New rating"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /businesses/business_id */

describe("DELETE /businesses/business_id ", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/businesses/${testBusinessIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: expect.any(Number) });
  });

  test("unauth if not admin", async function () {
    const resp = await request(app)
        .delete(`/businesses/${testBusinessIds[0]}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/businesses/${testBusinessIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if business missing", async function () {
    const resp = await request(app)
        .delete(`/businesses/9999`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

















      
