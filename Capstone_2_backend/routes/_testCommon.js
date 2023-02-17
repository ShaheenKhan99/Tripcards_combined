"use strict";

const db = require("../db.js");

const User = require("../models/user");
const Destination = require("../models/destination");
const Category = require("../models/category");
const Business = require("../models/business");
const Tripcard = require("../models/tripcard");
const Review = require("../models/review");

const { createToken } = require("../helpers/tokens");

const testUserIds = [];
const testCategoryIds = [];
const testDestinationIds = [];
const testBusinessIds = [];
const testTripcardIds = [];
const testReviewIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM businesses");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM tripcards");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM reviews");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM destinations");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM categories");


  testUserIds[0] = (await User.register(
    {
      username: "u1",
      first_name: "U1F",
      last_name: "U1L",
      email: "u1@email.com",
      password: "password1",
      bio: "U1Bio",
      is_admin: false,
    })).id;
  testUserIds[1] = (await User.register(
    {
      username: "u2",
      first_name: "U2F",
      last_name: "U2L",
      email: "u2@email.com",
      password: "password2",
      bio: "U2Bio",
      is_admin: false,
    })).id;
  testUserIds[2] =  (await User.register(
    {
      username: "u3",
      first_name: "U3F",
      last_name: "U3L",
      email: "u3@email.com",
      password: "password3",
      bio: "U3Bio",
      is_admin: false,
  })).id;
  console.log("username1: ", testUserIds[0], "username2: ", testUserIds[1], "username3: ", testUserIds[2]);

  testDestinationIds[0] = (await Destination.create(
    {
      city: "d1City",
      state: "d1State",
      country: "d1Country",
      latitude: 100000,
      longitude: 100000
  })).id;
  testDestinationIds[1] = (await Destination.create(
    {
      city: "d2City",
      state: "d2State",
      country: "d2Country",
      latitude: 200000,
      longitude: 200000,
  })).id;
  testDestinationIds[2] = (await Destination.create(
    {
      city: "d3City",
      state: "d3State",
      country: "d3Country",
      latitude: 300000,
      longitude: 300000
    })).id;

  testCategoryIds[0] = (await Category.create(
    {
      category_name: "c1Category"
    })).id;
  testCategoryIds[1] = (await Category.create(
     {
       category_name: "c2Category"
     })).id;
  testCategoryIds[2] = (await Category.create(
     {
       category_name: "c3Category"
     })).id;


  testBusinessIds[0] = (await Business.create(
    {
      yelp_id: "b1",
      business_name: "b1Name",
      address1: "b1Address1",
      address2: "b1Address2",
      city: "d1City",
      state: "d1State",
      country: "d1Country",
      zip_code: "b1Zipcode",
      latitude: 1111111111,
      longitude: 1111111111,
      phone: "1111",
      url: "http://b1.business",
      image_url: "http://b1.img",
      rating: 1,
      yelpReview_count: 1,
      sub_category: "s1Subcategory",
      category_name: "c1Category",
      category_id: testCategoryIds[0],
      destination_id: testDestinationIds[0]
    })).id;
  testBusinessIds[1] = (await Business.create(
    {
      yelp_id: "b2",
      business_name: "b2Name",
      address1: "b2Address1",
      address2: "b2Address2",
      city: "d2City",
      state: "d2State",
      country: "d2Country",
      zip_code: "b2Zipcode",
      latitude: 2222222222,
      longitude: 2222222222,
      phone: "2222",
      url: "http://b2.business",
      image_url: "http://b2.img",
      rating: 2,
      yelpReview_count: 2,
      sub_category: "s2Subcategory",
      category_name: "c2Category",
      category_id: Number(testCategoryIds[1]),
      destination_id: testDestinationIds[1]
    })).id;
    testBusinessIds[2] = (await Business.create(
    {
      yelp_id: "b3",
      business_name: "b3Name",
      address1: "b3Address1",
      address2: "b3Address2",
      city: "d3City",
      state: "d3State",
      country: "d3Country",
      zip_code: "b3Zipcode",
      latitude: 3333333333,
      longitude: 3333333333,
      phone: "3333",
      url: "http://b3.business",
      image_url: "http://b3.img",
      rating: 3,
      yelpReview_count: 3,
      sub_category: "s3Subcategory",
      category_name: "c3Category",
      category_id: Number(testCategoryIds[2]),
      destination_id: testDestinationIds[2]
   })).id;
  testBusinessIds[3] = (await Business.create(
    {
      yelp_id: "b4",
      business_name: "b4Name",
      address1: "b4Address1",
      address2: "b4Address2",
      city: "d1City",
      state: "d1State",
      country: "d1Country",
      zip_code: "b4Zipcode",
      latitude: 4444444444,
      longitude: 4444444444,
      phone: "4444",
      url: "http://b4.business",
      image_url: "http://b4.img",
      rating: 1,
      yelpReview_count: 1,
      sub_category: "s1Subcategory",
      category_name: "c1Category",
      category_id: testCategoryIds[0],
      destination_id: testDestinationIds[0]
   })).id;

  testTripcardIds[0] = (await Tripcard.create(
    {
      user_id: testUserIds[0],
      destination_id: testDestinationIds[0],
      username: "u1",
      city: "d1City",
      state: "d1State",
      country: "d1Country",
      created_on: "2022-12-01T01:51:07.802Z",
      keep_private: false,
      has_visited: false
    })).id;
  testTripcardIds[1] = (await Tripcard.create(
    {
      user_id: testUserIds[1],
      destination_id: testDestinationIds[1],
      username: "u2",
      city: "d2City",
      state: "d2State",
      country: "d2Country",
      created_on: "2022-12-01T01:51:07.802Z",
      keep_private: false,
      has_visited: false
    })).id;
  testTripcardIds[2] =  (await Tripcard.create(
    {
      user_id: testUserIds[2],
      destination_id: testDestinationIds[2],
      username: "u3",
      city: "d3City",
      state: "d3State",
      country: "d3Country",
      created_on: "2022-12-01T01:51:07.802Z",
      keep_private: false,
      has_visited: false
    })).id;
  testTripcardIds[3] =  (await Tripcard.create(
    {
      user_id: testUserIds[2],
      destination_id: testDestinationIds[0],
      username: "u3",
      city: "d1City",
      state: "d1State",
      country: "d1Country",
      created_on: "2022-12-01T01:51:07.802Z",
      keep_private: false,
      has_visited: false
    })).id;

  testReviewIds[0] = (await Review.create(
    { 
      business_id: testBusinessIds[0], 
      business_name: "b1",
      user_id: testUserIds[0], 
      username: "u1",
      text: "text1", 
      rating: 1, 
      created_on: '2022-12-01T01:51:07.802Z', 
      image_url: "http://r1.img"
  })).id;
  testReviewIds[1] = (await Review.create(
    { 
      business_id: testBusinessIds[1], 
      business_name: "b2",
      user_id: testUserIds[1], 
      username: "u2",
      text: "text2", 
      rating: 2, 
      created_on: '2022-12-01T01:51:07.802Z', 
      image_url: "http://r2.img"
  })).id;
  testReviewIds[2] = (await Review.create(
    { 
      business_id: testBusinessIds[2], 
      business_name: "b3",
      user_id: testUserIds[2], 
      username: "u3",
      text: "text3", 
      rating: 3, 
      created_on: '2022-12-01T01:51:07.802Z', 
      image_url: "http://r3.img"
  }));
  testReviewIds[3] = (await Review.create(
    { 
      business_id: testBusinessIds[2], 
      business_name: "b3",
      user_id: testUserIds[0], 
      username: "u1",
      text: "text4", 
      rating: 4, 
      created_on: '2022-12-01T01:51:07.802Z', 
      image_url: "http://r4.img"
  })).id;

 await Tripcard.addBusinessToTripcard(testTripcardIds[0], testBusinessIds[0]);
 await Tripcard.addBusinessToTripcard(testTripcardIds[1], testBusinessIds[1]);
 await Tripcard.addBusinessToTripcard(testTripcardIds[2], testBusinessIds[2]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({  username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testUserIds,
  testCategoryIds,
  testDestinationIds,
  testBusinessIds,
  testTripcardIds,
  testReviewIds
};
    
