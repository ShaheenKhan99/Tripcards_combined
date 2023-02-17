## **Tripcards** 

#### Tripcards is a destination focused travel app where users can search for places and create “tripcards” to save places based on their interests for any destination.


#### Users can search for places or activities such as arts, entertainment, restaurants, bookstores, shopping etc., view Yelp ratings and reviews and save the places to their own personalized destination “tripcard”.

#### **Features:**
- Any user can search by category and destination for places and view the results on the homepage
- A user can create a secure user account that uses the B-crypt hash to perform encryption to increase password safety
- A logged in user can:
  - search by category and/or destination to view places saved by other users 
  - search by username or destination to view tripcards for other users  
  - save places by first creating a tripcard for that destination and then add/delete places to their tripcard
  - view a list of all places saved on their tripcard
  - create multiple tripcards - one for each destination
  - choose to keep their tripcard private so that it is not visible to other users
  - mark tripcards as visited if they have visited the destination 
  - edit/delete their tripcard/s
  - edit/delete their profile
  - write/edit/delete reviews for any place saved by users
- There is no user interface directly on the site to create admin users. Admin users can be created through the interactive PSQL shell only. 
- Admin users can:
  - create, update and delete users 
  - update and delete tripcards 
  - update and delete reviews
  - update and delete categories 
  - update and delete businesses 
  - update and delete destinations
  



### **Data source**
#### The app uses multiple endpoints from the [Yelp Fusion API](https://fusion.yelp.com/) to source data :
 - business search - by keyword, category or location
 - business details - name, address, phone number, photos, rating
 - reviews - up to three review excerpts for a business


### **Technology Stack**
Front-End: HTML5 | CSS3 | JavaScript | React | React Bootstrap | React-Router | JSON Web Token

Back-End: Node.js | PostgreSQL | Express.js | JSON Schema | Axios | JWT Authentication | Bcrypt | RESTful APIs | SuperTest

### **Deployment**

Frontend deployed on Surge

Backend deployed on Heroku


### Schema Design

![DB Schema](Capstone_2_backend/src/DB_Schema_v5.png "DB_Schema diagram")


### Screenshots

![Home Page](Capstone_2_frontend/src/readme_images/HomePage.png "HomePage")

![Yelp Businesses List](Capstone_2_frontend/src/readme_images/YelpBusinessesList.png "Businesses List")

![User Favorites](Capstone_2_frontend/src/readme_images/UserFavorites.png "User Favorites")

![Yelp Business Details](Capstone_2_frontend/src/readme_images/YelpBusinessPage.png "Yelp Business Details")

![Business Details](Capstone_2_frontend/src/readme_images/BusinessPage.png "Business Details")

![All Tripcards](Capstone_2_frontend/src/readme_images/AllTripcards.png "All Tripcards")

![Tripcard Page](Capstone_2_frontend/src/readme_images/TripcardPage.png "Tripcard Page")

![My Tripcards](Capstone_2_frontend/src/readme_images/MyTripcards.png "My Tripcards")



### Author

[Shaheen Khan](https://github.com/ShaheenKhan99)



