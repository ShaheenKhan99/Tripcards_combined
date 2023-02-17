CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    password TEXT NOT NULL,
    bio TEXT,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    CONSTRAINT uc_city_state_country
    Unique(city, state, country)    
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE
);

CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    yelp_id VARCHAR UNIQUE,
    business_name VARCHAR NOT NULL,
    address1 VARCHAR NOT NULL,
    address2 VARCHAR,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    zip_code VARCHAR,
    latitude VARCHAR,
    longitude VARCHAR,
    phone VARCHAR,
    url VARCHAR,
    image_url VARCHAR,
    rating DECIMAL,
    yelpreview_count INTEGER,
    sub_category VARCHAR,
    category_name TEXT,
    category_id INTEGER REFERENCES categories ON DELETE CASCADE,
    destination_id INTEGER REFERENCES destinations ON DELETE CASCADE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses ON DELETE CASCADE,
    business_name VARCHAR NOT NULL,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    username VARCHAR NOT NULL,
    text TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    created_on TIMESTAMP,
    image_url VARCHAR, 
    CONSTRAINT uc_business_id_user_id
    Unique(business_id, user_id)    
);

CREATE TABLE tripcards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    destination_id INTEGER REFERENCES destinations ON DELETE CASCADE,
    username TEXT,
    city TEXT ,
    state TEXT,
    country TEXT, 
    created_on TIMESTAMP,
    keep_private BOOLEAN DEFAULT FALSE,
    has_visited BOOLEAN DEFAULT FALSE,
    CONSTRAINT uc_user_id_destination_id
    Unique(user_id, destination_id)    
);

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    category_id INTEGER REFERENCES categories ON DELETE CASCADE,
    tripcard_id INTEGER REFERENCES tripcards ON DELETE CASCADE,
    url VARCHAR,
    image_url VARCHAR
);

CREATE TABLE tripcardBusinesses (
    id SERIAL PRIMARY KEY,
    tripcard_id INTEGER REFERENCES tripcards ON DELETE CASCADE,
    business_id INTEGER REFERENCES businesses ON DELETE CASCADE,
    CONSTRAINT uc_tripcard_id_business_id
    Unique(tripcard_id, business_id)    
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users ON DELETE CASCADE,
    to_user_id INTEGER REFERENCES users ON DELETE CASCADE,
    body VARCHAR NOT NULL,
    sent_at TIMESTAMP NOT NULL,
    read_at TIMESTAMP NOT NULL
);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    user_being_followed_id INTEGER REFERENCES users ON DELETE CASCADE,
    user_following_id INTEGER REFERENCES users ON DELETE CASCADE
);




