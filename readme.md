# Express Auth Boilerplate

- create a node app
- .gitignore
- imnstall and set up express
- stubbed out Get auth/login, GET auth/signup, POST auth/login, POST auth/signup
- configured auth controller
- set up ejs, express-ejs-layouts
- set up the signup and login forms

## How to set up

1. Fork and Clone
2. Install Dependencies

```
npm i
```

3. Create a `config.json` with the following code:

```json
{
  "development": {
    "database": "express_auth_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "express_auth_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "express_auth_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

**note:** if your database requires a username and password, you'll need to include these fields as well.
create a database

```
sequelize db:create <insert db name here>
```

5. migrate the `user` model to your database

```
sequelize db:migrate
```

6. add a `SESSION_SECRET` AND `PORT` environment variable in a `.env` file (can be any string).

7. Run `nodemon` to start up app
