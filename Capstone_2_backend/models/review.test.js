"use strict";

const db = require("../db.js");
const Review = require("./review.js");
const { BadRequestError, NotFoundError } = require("../ExpressError");
const {
  testUserIds,
  testBusinessIds,
  testReviewIds,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** Create Review */

describe("create", function () {
  let newReview = {
              business_id: null, 
              business_name: "b1",
              user_id: null, 
              username: "u1",
              text: "text5", 
              rating: "5", 
              created_on: new Date(), 
              image_url: "http://r5.img"
      };


  test("works", async function () {
    let review = await Review.create(newReview);

    expect(review).toEqual({
      ...newReview,
      id: expect.any(Number),
    });
  });


  test("bad request with dupe", async function () {
    try {
      await Review.create(newReview);
      await Review.create(newReview);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let reviews = await Review.findAll();
    expect(reviews).toEqual([
      { 
        id: testReviewIds[0],
        business_id: testBusinessIds[0], 
        business_name: "b1",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text1", 
        rating: "1", 
        created_on: expect.any(Date), 
        image_url: "http://r1.img"
      },
      { 
        id: testReviewIds[1],
        business_id: testBusinessIds[1], 
        business_name: "b2",
        user_id: testUserIds[1], 
        username: "u2",
        text: "text2", 
        rating: "2", 
        created_on: expect.any(Date), 
        image_url: "http://r2.img"
      },
      { 
        id: testReviewIds[2],
        business_id: testBusinessIds[2], 
        business_name: "b3",
        user_id: testUserIds[2], 
        username: "u3",
        text: "text3", 
        rating: "3", 
        created_on: expect.any(Date), 
        image_url: "http://r3.img"
      },
      { 
        id: testReviewIds[3],
        business_id: testBusinessIds[2], 
        business_name: "b3",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text4", 
        rating: "4", 
        created_on: expect.any(Date), 
        image_url: "http://r4.img"
      }
    ]);
  });

  test("works: by user_id", async function () {
    let reviews = await Review.findAll({ user_id: testUserIds[0] });
    expect(reviews).toEqual([
      { 
        id: testReviewIds[0],
        business_id: testBusinessIds[0], 
        business_name: "b1",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text1", 
        rating: "1", 
        created_on: expect.any(Date), 
        image_url: "http://r1.img"
      },
      { 
        id: testReviewIds[3],
        business_id: testBusinessIds[2], 
        business_name: "b3",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text4", 
        rating: "4", 
        created_on: expect.any(Date), 
        image_url: "http://r4.img"
      }
    ]);
  });

  test("works: by username", async function () {
    let reviews = await Review.findAll({ username: "u3" });
    expect(reviews).toEqual([
      { 
        id: testReviewIds[2],
        business_id: testBusinessIds[2], 
        business_name: "b3",
        user_id: testUserIds[2], 
        username: "u3",
        text: "text3", 
        rating: "3", 
        created_on: expect.any(Date), 
        image_url: "http://r3.img"
      }
    ]);
  });

  test("works: by business_id", async function () {
    let reviews = await Review.findAll({ business_id: testBusinessIds[0] });
    expect(reviews).toEqual([
      { 
        id: testReviewIds[0],
        business_id: testBusinessIds[0], 
        business_name: "b1",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text1", 
        rating: "1", 
        created_on: expect.any(Date), 
        image_url: "http://r1.img"
      }  
    ]);
  });

  test("works: by business_name", async function () {
    let reviews = await Review.findAll({ business_name: "b2" });
    expect(reviews).toEqual([
      { 
        id: testReviewIds[1],
        business_id: testBusinessIds[1], 
        business_name: "b2",
        user_id: testUserIds[1], 
        username: "u2",
        text: "text2", 
        rating: "2", 
        created_on: expect.any(Date), 
        image_url: "http://r2.img"
      }
    ]);
  });

  test("works: by rating", async function () {
    let reviews = await Review.findAll({ rating: 4 });
    expect(reviews).toEqual([
      { 
        id: testReviewIds[3],
        business_id: testBusinessIds[2], 
        business_name: "b3",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text4", 
        rating: "4", 
        created_on: expect.any(Date), 
        image_url: "http://r4.img"
      }
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let review = await Review.get(testReviewIds[0]);
    expect(review).toEqual(
      { 
        id: testReviewIds[0],
        business_id: testBusinessIds[0], 
        business_name: "b1",
        user_id: testUserIds[0], 
        username: "u1",
        text: "text1", 
        rating: "1", 
        created_on: expect.any(Date), 
        image_url: "http://r1.img"
      }
    );
  });

  test("not found if no such review", async function () {
    try {
      await Review.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
              text: "New Text",
              username: "New Username",
              image_url: "http://new.img",
              rating: "3"
  };

  test("works", async function () {
    let review = await Review.update(testReviewIds[0], updateData);

    expect(review.text).toEqual("New Text");
    expect(review.username).toEqual("New Username");
    expect(review.image_url).toEqual("http://new.img");
    expect(review.rating).toEqual("3");

    const result = await db.query(
          `SELECT id,
                  business_id, 
                  business_name,
                  user_id, 
                  username,
                  text, 
                  rating,
                  created_on, 
                  image_url 
            FROM reviews
            WHERE id = ${testReviewIds[0]}`);
    let updatedReview = result.rows[0];

    expect(updatedReview.text).toEqual("New Text"); 
    expect (updatedReview.username).toEqual("New Username");
    expect (updatedReview.image_url).toEqual("http://new.img");
    expect (updatedReview.rating).toEqual("3");
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
              text: "Updated Text",
              username: "Updated Username",
              image_url: null,
              rating: "3"
            }
    
    let review = await Review.update(testReviewIds[1], updateDataSetNulls);
      expect(review.text).toEqual("Updated Text");
      expect(review.username).toEqual("Updated Username");
      expect(review.image_url).toBeNull();
      expect(review.rating).toEqual("3");

      const result = await db.query(
        `SELECT id,
                  business_id, 
                  business_name,
                  user_id, 
                  username,
                  text, 
                  rating,
                  created_on, 
                  image_url 
            FROM reviews
            WHERE id = ${testReviewIds[1]}`);
    let updatedReview = result.rows[0];
      expect(updatedReview.text).toEqual("Updated Text");
      expect(updatedReview.username).toEqual("Updated Username");
      expect(updatedReview.image_url).toBeNull();
      expect(updatedReview.rating).toEqual("3");
  });

  test("not found if no such review", async function () {
      try {
        await Review.update(99999, updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

  test("bad request with no data", async function () {
    try {
        await Review.update(testReviewIds[1], {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Review.remove(testReviewIds[1]);
    const res = await db.query(
        `SELECT id FROM reviews WHERE id=${testReviewIds[1]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such review", async function () {
    try {
      await Review.remove(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});







