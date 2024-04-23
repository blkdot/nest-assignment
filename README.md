
## Nest.js Test Task

[Nest Test Task Source code](https://github.com/nestjs/nest)

## Objective:
Develop a RESTful API for a cat adoption agency. The API will manage cat profiles, and user interactions.

## Key Features:
• Cat Profiles: Create, read, update, and delete profiles for cats available for adoption.

• User Authentication: Secure user registration and login functionality.

• Favorites: Allow authenticated users to mark cats as favorites.

## Technical Specifications

• Nest.js

• TypeORM with a PostgreSQL

• Passport.js and JWT tokens

• TypeORM with a PostgreSQL

• Redis for manage jwt token

• Unit test

## Environments

• Install Node v18

• Install PostgreSQL

• Install Redis server and GUI tool such as Another Redis Desktop Manager for manage jwt token

• Install Postman for getting response


## Installation

```bash
$ npm install
```

### Copy .env file

```bash
$ sudo cp .env.sample .env
```
And then replace your local PostgreSQL db connection and redis.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
