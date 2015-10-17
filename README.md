#Instagram Tag Search

Instagram Tag Search is a simple web application that searches Instagram given a hashtag and a date range. The backend comprises of a Node.js server using Express and a Postgres DB to save the results. The frontend is made using ReactJS.

The API has a single endpoint:

*Tag Search*
----
  Returns json data about a hashtag search.

* **URL**

  /api/tagsearch/:tag'

* **Method:**

  `GET`
  
*  **URL Path Params**

   **Required:**
 
   `tag=[string] tag without the #`
   
*  **URL Query Params**

   **Required:**
 
   `startDate=[string] MM-DD-YYYY`   
   `endDate=[string] MM-DD-YYYY` 
   
   **Optional:**
   
   `offset=[integer] Offset of results to show`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `[Instagram Data][Instagram Data]...`
       <br />Instagram Data:

      ```javascript
      {
        media_type : image or video,
        media_url : URL containing raw image or video,
        username: Instagram Username,
        instagram_url: URL containing Instagram post with video or image,
        createdTime: Time media was tagged in Unix time 
      }
      ```
 
* **Error Response:**

  * **Code:** 400 NOT FOUND <br />
    **Content:** `Invalid date(s)`

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `Unable to process request`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/tagsearch/javascript?startDate=09-01-2015&endDate=09-08-2015",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
*UI* 
----
The UI can be accessed by visiting: [http://localhost:3000](http://localhost:3000)  

#Requirements
* Postgres with a DB entitled Instagram
* Instagram API Client ID

#Setup
### Run resources/startup.sql on newly created Instagram DB
### Run the following commands
```
npm install
npm install -g grunt-cli
grunt
env DATABASE_URL=<Postgres Connection URL> INSTAGRAM_CLIENT_ID=<Instagram Client ID> ./bin/www
```
### Example Postgres Connection URL:
```
postgres://Adam@localhost:5432/Instagram
```
