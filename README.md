# Production app's backend

<h4> Backend for a production entreprise :information_desk_person: , made with expressjs </h4>

## how to use

- fork it
- clone it
- create a mongodb cluster/db
- add a .env file and insert :
  - MONGO_USER = \<put here the username from the mongodb server\>
  - MONGO_PSW = \<put here the password from the mongodb server\>
  - MONGO_SERVER = \<put here your server address\>
  - MONGO_DB = \<put here your db name\>
  - MONGO_CONNECTION_STRING = mongodb+srv://${MONGO_USER}:${MONGO_PSW}@${MONGO_SERVER}/${MONGO_DB}?retryWrites=true&w=majority
  - ACCESS_TOKEN_SECRET = \<put here a secret key that would help you generate uniques access tokens\>
  - REFRESH_TOKEN_SECRET = \<put here a secret key that would help you generate uniques access tokens\>
- npm install
- npm start and enjoy !
