
## Install dependencies

In the server directory, open the command line and install all dependecies
```sh
yarn install
```

## Requirements

The server needs:
-  a minimum of node v12.0.0 as specified in the `.nvmrc` file
-  Postgresql (You need to first create the database via postgres CLI before the server can connect to it,  Checkout [this tutorial](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/))

## Adding Environment variables
create a `.env` file add the following config variables

```env
SQL_HOST=<YOUR_SQL_HOST_HERE>
SQL_USER=<YOUR_SQL_USER_HERE>
SQL_PASSWORD=<YOUR_SQL_PASSWORD_HERE>
SQL_DATABASE=<YOUR_SQL_DATABSE_HERE>
PORT=<YOUR_PORT_HERE>

```

In the `ormconfig.json` and `ormconfig.ts` files, I have used `the_room_services` as the database,
You're free to use any database name of your choice as long as you've created previously. Also remember to keep it consistent across the following files
- `ormconfig.json`
- `ormconfig.ts`
- `.env` — `process.env.SQL_DATABASE` to be precise

## Run database migrations

I have put a script in the `package.json` that executes the database migrations

```
yarn run:db:migrations
```

## Seeding the database

 The spec did not indicate how services or promocodes would be created, so the database needs to be seeded.
 
 NOTES
  -  All Service names are UPPERCASE and  STRING types
  -  All promo codes are UPPERCASE and  STRING types
  -  Discount values are generated randomly with Math.random()

  See the `src/utils/db/seed.ts` file to add more services and promo codes. To seed the database run the below command
  
```sh
yarn seed:db
```

## Running the server
To run the server without intending to make changes to the code
```sh
yarn start 
```

To run the server in development mode
```
yarn dev
```
then when you make changes in the code, rebuild with `yarn build`, that would automatically restart the server

## Running tests

A seperate database maybe needed for the tests, in the `src/utils/tests/helpers.ts` file you can specify a separate database
to run the tests on, Note — You will have create the database first via the  postgres CLI before you can connect to it.

You can also use the same database the application uses, in that case you will edit the `database` option in  `src/utils/test/helpers.ts`
to point the application database, but note that this has some consequences which are: 
- Automatically drops every table in the database
- Deletes the migrations table so you can no longer keep track of migrations
- Schemas changes are automatically generated and synchronized
- Custom changes in migrations will no longer be possible

So it's better to use a separate database to run the tests.

```sh
yarn test
```
