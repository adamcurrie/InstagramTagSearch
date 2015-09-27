Instagram Tag Search

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
*** Example Postgres Connection URL:
```
postgres://Adam@localhost:5432/Instagram
```