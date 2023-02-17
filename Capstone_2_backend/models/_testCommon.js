const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUserIds = [];
const testCategoryIds = [];
const testDestinationIds = [];
const testBusinessIds = [];
const testTripcardIds = [];
const testReviewIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM businesses");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM tripcards");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM reviews");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM categories");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM destinations");


  const userResults = await db.query(`INSERT INTO users(
                                    username,
                                    password,
                                    first_name,
                                    last_name,
                                    email,
                                    bio)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', 'U1Bio'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', 'U2Bio'),
               ('u3', $3, 'U3F', 'U3L', 'u3@email.com', 'U3Bio')
        RETURNING id`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password3", BCRYPT_WORK_FACTOR)
      ]);
  testUserIds.splice(0, 0, ...userResults.rows.map(r => r.id));


  const destinationResults = await db.query(`INSERT INTO destinations(
                                          city, 
                                          state, 
                                          country, 
                                          latitude, 
                                          longitude)
                  VALUES ('d1City', 'd1State', 'd1Country', 100000, 100000),
                         ('d2City', 'd2State', 'd2Country', 200000, 200000),
                         ('d3City', 'd3State', 'd3Country', 300000, 300000)   
                  RETURNING id`);
  testDestinationIds.splice(0, 0, ...destinationResults.rows.map(r => r.id));


  const categoryResults = await db.query(`INSERT INTO categories (category_name)
                  VALUES ('c1Category'),
                         ('c2Category'),
                         ('c3Category')
                  RETURNING id`);
  testCategoryIds.splice(0, 0, ...categoryResults.rows.map(r => r.id));


  const businessResults = await db.query(`INSERT INTO businesses(  
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
                                yelpreview_count,
                                sub_category,
                                category_name,
                                category_id, 
                                destination_id)
                  VALUES ('b1', 'b1Name', 'b1Address1', 'b1Address2', 'd1City',  'd1State', 'd1Country', 'b1Zipcode', 1111111111, 1111111111, '1111', 'http://b1.business', 'http://b1.img', 1, 1, 's1Subcategory', 'c1Category', $1, $4),

                        ('b2', 'b2Name', 'b2Address1', 'b2Address2', 'd2City', 'd2State', 'd2Country', 'b2Zipcode', 2222222222, 2222222222, '2222', 'http://b2.business', 'http://b2.img', 2, 2, 's2Subcategory', 'c2Category', $2, $5),

                        ('b3', 'b3Name', 'b3Address1', 'b3Address2', 'd3City', 'd3State', 'd3Country', 'b3Zipcode', 3333333333, 3333333333, '3333', 'http://b3.business', 'http://b3.img', 3, 3, 's3Subcategory', 'c3Category', $3, $6),
                        
                        ('b4', 'b4Name', 'b4Address1', 'b4Address2','d1City',  'd1State', 'd1Country', 'b4Zipcode', 4444444444, 4444444444, '4444', 'http://b4.business', 'http://b4.img', 1, 1, 's1Subcategory', 'c1Category', $1, $4)  RETURNING id`,
                        [testCategoryIds[0], testCategoryIds[1], testCategoryIds[2], testDestinationIds[0], testDestinationIds[1], testDestinationIds[2]]);
  testBusinessIds.splice(0, 0, ...businessResults.rows.map(r => r.id));
    

  const tripcardResults = await db.query(`INSERT INTO tripcards(
                                      user_id,
                                      destination_id, 
                                      username,
                                      city,
                                      state,
                                      country,
                                      created_on,
                                      keep_private,
                                      has_visited)
                    VALUES ($4, $1, 'u1', 'd1City', 'd1State', 'd1Country', '2022-12-01T01:51:07.802Z', false, false),

                          ($5, $2, 'u2', 'd2City', 'd2State', 'd2Country', '2022-12-01T01:51:07.802Z', false, false),

                          ($6, $3, 'u3', 'd3City', 'd3State', 'd3Country', '2022-12-01T01:51:07.802Z', false, false),

                          ($6, $1, 'u3', 'd1City', 'd1State', 'd1Country', '2022-12-01T01:51:07.802Z', false, false)  
                          RETURNING id`,
                          [testDestinationIds[0], testDestinationIds[1], testDestinationIds[2], testUserIds[0], testUserIds[1], testUserIds[2]]);
  testTripcardIds.splice(0, 0, ...tripcardResults.rows.map(r => r.id));


  await db.query(`INSERT INTO tripcardbusinesses(
                              tripcard_id, business_id)
                  VALUES ($1, $4),
                         ($2, $5),
                         ($3, $6)`,
                         [testTripcardIds[0], testTripcardIds[1], testTripcardIds[2], testBusinessIds[0], testBusinessIds[1], testBusinessIds[2]]);
 
  
  const reviewResults = await db.query(
                          `INSERT INTO reviews( 
                               business_id, 
                               business_name,
                               user_id, 
                               username,
                               text, 
                               rating,
                               created_on, 
                               image_url)
                           VALUES  ($4, 'b1', $1, 'u1', 'text1', 1, '2022-12-01T01:51:07.802Z', 'http://r1.img'),

                                  ($5, 'b2', $2, 'u2', 'text2', 2, '2022-12-01T01:51:07.802Z', 'http://r2.img'),

                                  ($6, 'b3', $3, 'u3', 'text3', 3, '2022-12-01T01:51:07.802Z', 'http://r3.img'),

                                  ($6, 'b3', $1, 'u1', 'text4', 4, '2022-12-01T01:51:07.802Z', 'http://r4.img')
                                  RETURNING id`,
                                [testUserIds[0], testUserIds[1], testUserIds[2], testBusinessIds[0], testBusinessIds[1], testBusinessIds[2]]);
  testReviewIds.splice(0, 0, ...reviewResults.rows.map(r => r.id));
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testCategoryIds,
  testDestinationIds,
  testBusinessIds,
  testTripcardIds,
  testReviewIds,
};

