-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, bio, is_admin)
VALUES ('testuser1', 'password1', 'Test1', 'User1', 'testuser1@email.com',   'An avid traveler', TRUE),
        ('testuser2', 'password2', 'Test2', 'User2', 'testuser2@email.com', 'An eager planner', FALSE);
              

INSERT INTO destinations (city,
                        state,
                        country)
VALUES 
       ('Buenos Aires', NULL, 'ARGENTINA'),
       ('Adelaide', NULL,'AUSTRALIA'),
       ('Brisbane', NULL, 'AUSTRALIA'),
       ('Melbourne', NULL, 'AUSTRALIA'),
       ('Perth', NULL, 'AUSTRALIA'),
       ('Sydney', NULL,'AUSTRALIA'),
       ('Vienna', NULL, 'AUSTRIA'),
       ('Antwerp',  NULL, 'BELGIUM'),
       ('Brussels', NULL, 'BELGIUM'),
       ('Rio de Janeiro',  NULL, 'BRAZIL'),
       ('São Paulo',  NULL, 'BRAZIL'),
       ('Calgary', 'AB', 'CANADA'),
       ('Edmonton', 'AB', 'CANADA'),
       ('Halifax', 'NS', 'CANADA'),
       ('Montréal', 'QC','CANADA'),
       ('Ottawa', 'ON','CANADA'),
       ('Toronto', 'ON', 'CANADA'),
       ('Vancouver','BC', 'CANADA'),
       ('Santiago', NULL, 'CHILE'),
       ('Prague', NULL, 'CZECH REPUBLIC'),
       ('Copenhagen', NULL,  'DENMARK'),
       ('Helsinki', NULL, 'FINLAND'),
       ('Lyon', NULL, 'FRANCE'),
       ('Marseille',NULL, 'FRANCE'),
       ('Paris', NULL, 'FRANCE'),
       ('Berlin', NULL, 'GERMANY'),
       ('Frankfurt', NULL, 'GERMANY'),
       ('Hamburg', NULL, 'GERMANY'),
       ('Cologne', NULL, 'GERMANY'),
       ('Munich', NULL, 'GERMANY'),
       ('Hong Kong', NULL, 'HONG KONG'),
       ('Milan', NULL, 'ITALY'),
       ('Rome', NULL, 'ITALY'),
       ('Tokyo', NULL, 'JAPAN'),
       ('Kyoto', NULL, 'JAPAN'),
       ('Kuala Lumpur', NULL, 'MALAYSIA'),
       ('México', NULL, 'MEXICO'),
       ('Auckland', NULL, 'NEW ZEALAND'),
       ('Oslo', NULL, 'NORWAY'),
       ('Manila', NULL, 'PHILIPPINES'),
       ('Kraków', NULL, 'POLAND'),
       ('Warsaw', NULL, 'POLAND'),
       ('Lisbon', NULL, 'PORTUGAL'),
       ('Dublin', NULL, 'REPUBLIC OF IRELAND'),
       ('Singapore', NULL, 'SINGAPORE'),
       ('Barcelona', NULL, 'SPAIN'),
       ('Madrid', NULL, 'SPAIN'),
       ('Stockholm', NULL, 'SWEDEN'),
       ('Zürich', NULL, 'SWITZERLAND'),
       ('Taiwan', NULL, 'TAIWAN'),
       ('Amsterdam', NULL, 'THE NETHERLANDS'),
       ('İstanbul', NULL,'TURKEY'),
       ('Belfast', NULL, 'UNITED KINGDOM'),
       ('Brighton', NULL, 'UNITED KINGDOM'),
       ('Bristol', NULL, 'UNITED KINGDOM'),
       ('Cardiff', NULL, 'UNITED KINGDOM'),
       ('Edinburgh', NULL,'UNITED KINGDOM'),
       ('Glasgow', NULL, 'UNITED KINGDOM'),
       ('Leeds', NULL, 'UNITED KINGDOM'),
       ('Liverpool', NULL, 'UNITED KINGDOM'),
       ('London', NULL, 'UNITED KINGDOM'),
       ('Manchester', NULL, 'UNITED KINGDOM'),
       ('Phoenix', 'AZ', 'US'),
       ('Scottsdale', 'AZ', 'US'),
       ('Tempe', 'AZ', 'US'),
       ('Tucson', 'AZ', 'US'),
       ('Alameda', 'CA', 'US'),
       ('Albany', 'CA', 'US'),
       ('Alhambra', 'CA', 'US'),
       ('Anaheim', 'CA', 'US'),
       ('Belmont', 'CA', 'US'),
       ('Berkeley', 'CA', 'US'),
       ('Beverly Hills', 'CA', 'US'),
       ('Big Sur', 'CA', 'US'),
       ('Burbank', 'CA', 'US'),
       ('Concord', 'CA', 'US'),
       ('Costa Mesa', 'CA', 'US'),
       ('Culver City', 'CA', 'US'),
       ('Cupertino', 'CA', 'US'),
       ('Daly City', 'CA', 'US'),
       ('Davis', 'CA', 'US'),
       ('Dublin', 'CA', 'US'),
       ('Emeryville', 'CA', 'US'),
       ('Foster City', 'CA', 'US'),
       ('Fremont', 'CA', 'US'),
       ('Glendale', 'CA', 'US'),
       ('Hayward', 'CA', 'US'),
       ('Healdsburg', 'CA', 'US'),
       ('Huntington Beach', 'CA', 'US'),
       ('Irvine', 'CA', 'US'),
       ('La Jolla', 'CA', 'US'),
       ('Livermore', 'CA', 'US'),
       ('Long Beach', 'CA', 'US'),
       ('Los Altos', 'CA', 'US'),
       ('Los Angeles', 'CA', 'US'),
       ('Los Gatos', 'CA', 'US'),
       ('Marina del Rey', 'CA', 'US'),
       ('Menlo Park', 'CA', 'US'),
       ('Mill Valley', 'CA', 'US'),
       ('Millbrae', 'CA', 'US'),
       ('Milpitas', 'CA', 'US'),
       ('Monterey', 'CA', 'US'),
       ('Mountain View', 'CA', 'US'),
       ('Napa', 'CA', 'US'),
       ('Newark', 'CA', 'US'),
       ('Newport Beach', 'CA', 'US'),
       ('Oakland', 'CA', 'US'),
       ('Orange County', 'CA', 'US'),
       ('Palo Alto', 'CA', 'US'),
       ('Park La Brea', 'CA', 'US'),
       ('Pasadena', 'CA', 'US'),
       ('Pleasanton', 'CA', 'US'),
       ('Redondo Beach', 'CA', 'US'),
       ('Redwood City', 'CA', 'US'),
       ('Sacramento', 'CA', 'US'),
       ('San Bruno', 'CA', 'US'),
       ('San Carlos', 'CA', 'US'),
       ('San Diego', 'CA', 'US'),
       ('San Francisco', 'CA', 'US'),
       ('San Leandro', 'CA', 'US'),
       ('San Mateo', 'CA', 'US'),
       ('San Rafael', 'CA', 'US'),
       ('Santa Barbara', 'CA', 'US'),
       ('Santa Clara', 'CA', 'US'),
       ('Santa Cruz', 'CA', 'US'),
       ('Santa Monica', 'CA', 'US'),
       ('Santa Rosa', 'CA', 'US'),
       ('Sausalito', 'CA', 'US'),
       ('Sonoma', 'CA', 'US'),
       ('South Lake Tahoe', 'CA', 'US'),
       ('Stockton', 'CA', 'US'),
       ('Studio City', 'CA', 'US'),
       ('Sunnyvale', 'CA', 'US'),
       ('Torrance', 'CA', 'US'),
       ('Union City', 'CA', 'US'),
       ('Venice', 'CA', 'US'),
       ('Walnut Creek', 'CA', 'US'),
       ('West Hollywood', 'CA', 'US'),
       ('West Los Angeles', 'CA', 'US'),
       ('Westwood', 'CA', 'US'),
       ('Yountville', 'CA', 'US'),
       ('Boulder', 'CO', 'US'),
       ('Denver', 'CO', 'US'),
       ('Hartford', 'CT', 'US'),
       ('New Haven', 'CT', 'US'),
       ('Washington DC', 'DC', 'US'),
       ('Fort Lauderdale', 'FL', 'US'),
       ('Gainesville', 'FL', 'US'),
       ('Miami', 'FL', 'US'),
       ('Miami Beach', 'FL', 'US'),
       ('Orlando', 'FL', 'US'),
       ('Tampa', 'FL', 'US'),
       ('Atlanta', 'GA', 'US'),
       ('Savannah', 'GA', 'US'),
       ('Honolulu', 'HI', 'US'),
       ('Lahaina', 'HI', 'US'),
       ('Iowa City', 'IA', 'US'),
       ('Boise', 'ID', 'US'),
       ('Chicago', 'IL', 'US'),
       ('Evanston', 'IL', 'US'),
       ('Naperville', 'IL', 'US'),
       ('Schaumburg', 'IL', 'US'),
       ('Skokie', 'IL', 'US'),
       ('Bloomington', 'IN', 'US'),
       ('Indianapolis', 'IN', 'US'),
       ('Louisville', 'KY', 'US'),
       ('New Orleans', 'LA', 'US'),
       ('Allston', 'MA', 'US'),
       ('Boston', 'MA', 'US'),
       ('Brighton', 'MA', 'US'),
       ('Brookline', 'MA', 'US'),
       ('Cambridge', 'MA', 'US'),
       ('Somerville', 'MA', 'US'),
       ('Baltimore', 'MD', 'US'),
       ('Ann Arbor', 'MI', 'US'),
       ('Detroit', 'MI', 'US'),
       ('Minneapolis', 'MN', 'US'),
       ('Saint Paul', 'MN', 'US'),
       ('Kansas City', 'MO', 'US'),
       ('Saint Louis', 'MO', 'US'),
       ('Charlotte', 'NC', 'US'),
       ('Durham', 'NC', 'US'),
       ('Raleigh', 'NC', 'US'),
       ('Newark', 'NJ', 'US'),
       ('Princeton', 'NJ', 'US'),
       ('Albuquerque', 'NM', 'US'),
       ('Santa Fe', 'NM', 'US'),
       ('Las Vegas', 'NV', 'US'),
       ('Reno', 'NV', 'US'),
       ('Brooklyn', 'NY', 'US'),
       ('Buffalo', 'NY', 'US'),
       ('Flushing', 'NY', 'US'),
       ('Long Island City', 'NY', 'US'), 
       ('New York', 'NY', 'US'),
       ('Cincinnati', 'OH', 'US'),
       ('Cleveland', 'OH', 'US'),
       ('Columbus', 'OH', 'US'),
       ('Portland', 'OR', 'US'),
       ('Salem', 'OR', 'US'),
       ('Philadelphia', 'PA', 'US'),
       ('Pittsburgh', 'PA', 'US'),
       ('Providence', 'RI', 'US'),
       ('Charleston', 'SC', 'US'),
       ('Memphis', 'TN', 'US'),
       ('Nashville', 'TN', 'US'),
       ('Austin', 'TX', 'US'),
       ('Dallas', 'TX', 'US'),
       ('Houston', 'TX', 'US'),
       ('San Antonio', 'TX', 'US'),
       ('Salt Lake City', 'UT', 'US'),
       ('Alexandria', 'VA', 'US'),
       ('Arlington', 'VA', 'US'),
       ('Richmond', 'VA', 'US'),
       ('Burlington', 'VT', 'US'),
       ('Bellevue', 'WA', 'US'),
       ('Redmond', 'WA', 'US'),
       ('Seattle', 'WA', 'US'),
       ('Milwaukee', 'WI', 'US'),
       ('Madison', 'WI', 'US');


INSERT INTO categories (category_name)
VALUES ('Active Life'),
        ('Amusement Parks'),
        ('Aquariums'),
        ('Antiques'),
        ('Arts & Entertainment'),
        ('Art Galleries & Museums'),
        ('Arts and Crafts'),
        ('Bakeries'),
        ('Beaches'),
        ('Bookstores'),
        ('Campgrounds'),
        ('Clothing'),
        ('Coffee & Tea'),
        ('Food'),
        ('Farms'),
        ('Farmers Markets'),
        ('Fashion'),
        ('Gardens'),
        ('Hotels'),
        ('Music'),
        ('Nightlife'), 
        ('Parks'),
        ('Playgrounds'),
        ('Religious Organizations'),
        ('Restaurants'),
        ('Shopping'),
        ('Sports'),
        ('Skiing'),
        ('Tours'),
        ('Toys'),
        ('Zoos');
       


INSERT INTO follows(user_being_followed_id, user_following_id)
VALUES(1, 2),
      (2, 1);
      





