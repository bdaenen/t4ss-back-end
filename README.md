# T4SS Backend

## Setup
1. Create a file named `.env` containing the following variables and fill them in:
    ```
    DB_USER=
    DB_HOST=
    DB_PASSWORD=
    DB_NAME=
    DB_PORT=3306
    IS_HTTPS=0
   ```
2. run `npm install`
3. run `npm run migrate`. This generates your database.
4. run `npm start`. This starts your server.

Now you can access your server from 127.0.0.1:3000.

## endpoints
* `/cats`
  * `GET`: get a list of all cats
* `/cats/<id>`
  * `GET`: get a specific cat with its relations by id.
  * `PUT/PATCH`: update a cat's data. 
  * `DELETE`: delete a cat by id. This does not check dam/sire fields and can break your integrity.
* `/cats/add`
  * `POST`: create a new cat
* `/catteries`
  * `GET`: get a list of catteries
* `/catteries/<id>`
  * `GET`: get a specific cattery by id
  * `PUT/PATCH`: update a cattery's data
  * `DELETE`: delete a cattery by id
* `/catteries/add`
  * `POST`: create a new cattery
