# Node Express API Boilerplate
This project is based on the
[Node API and Client Boilerplate](https://github.com/anthub-services/node-api-and-client-boilerplate).
Required node version is `9.2.1`.
The API app is powered by [Express](https://expressjs.com/)
and used as API service for the [Create React App Boilerplate](https://github.com/anthub-services/create-react-app-boilerplate).

## Other API App Boilerplate

- [Node Express API Mockup Data Boilerplate](https://github.com/anthub-services/node-express-api-mockup-data-boilerplate) –
 non-database API server powered by [Express](https://expressjs.com/)

## Starting the App

Note: Only change the environment variables for `POSTGRES_USER` and `POSTGRES_PASSWORD` if working on local machine.

Copy `.env.dist` to `.env` and change the values of the environment variables if needed.

```
PORT=7770
ALLOW_ORIGIN=http://localhost:7771
JWT_SECRET=jwtsecretcode
POSTGRES_PORT=5432
POSTGRES_DB=express_api_dev
POSTGRES_USER=express_api_user
POSTGRES_PASSWORD=root
```

Then run the following commands:

```
yarn
yarn start
```

Note: The database must be created and initialized after starting the app on fresh installation.
See **Database using PostgreSQL and Sequelize** section. See **Bash Commands** section for Docker.

Access the app at <http://localhost:7770>.

## Docker

Download and install the [Docker Community Edition](https://www.docker.com/community-edition).

Note: See **Bash Commands** section for Docker.

## Database using PostgreSQL and Sequelize

**Installing PostgreSQL**

**Mac:** [Getting Started with PostgreSQL on Mac OSX](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb)
<br>
**Windows:** [Installing PostgreSQL, Creating a User, and Creating a Database](https://confluence.atlassian.com/display/CONF30/Database+Setup+for+PostgreSQL+on+Windows)

NOTE: For Mac users, you can run the PostgreSQL server on a separate terminal console by running the following command:

```
postgres -D /usr/local/var/postgres
```

**Create and Initialize Database**

Open a terminal console and run the following commands:

```
sequelize db:create
sequelize db:migrate
sequelize db:seed:all
```

To drop database, run the following command:

```
sequelize db:drop
```

See **Bash Commands** section for Docker.

## Bash Commands

On the `root` directory of the project, run the following commands:

Note: To view the Docker containers, open another terminal console then enter `docker ps`.
To manage separate Docker instance for API, open another terminal console and run the commands below.

### Docker

| Command                                | Description                                                        |
|----------------------------------------|--------------------------------------------------------------------|
| `./bin/install`                        | Build the Docker containers, initialise database and start the app |
| `./bin/reinstall`                      | Re-build containers, re-initialise database and start the app      |
| `./bin/start`                          | Start all the services (API and database)                          |
| `./bin/stop`                           | Stop all the services                                              |
| `./bin/console <container ID or Name>` | Access the terminal console of the API container                   |

### Database

**Local**

| Command                               | Description                                                |
|---------------------------------------|------------------------------------------------------------|
| `./bin/pg/local/start`                | Start the PostgreSQL server (for Mac users only)           |
| `./bin/pg/local/resetdb`              | Drop and re-initialise database                            |
| `./bin/pg/local/migrate`              | Run new schema migration                                   |
| `./bin/pg/local/migrateundo`          | Revert the recent schema migration                         |
| `./bin/pg/local/seed <seed file>`     | Run specific data seed file with or without .js extension  |
| `./bin/pg/local/seedundo <seed file>` | Revert the seed of specific data seed file                 |
| `./bin/pg/local/psql`                 | Access the database console                                |

**Docker**

- To run the commands for Docker database service, simply remove the `local` from the command
- The `start` command works only in local machine
- Used `./bin/pg/psql <database container ID or Name>` to access the database console

## Users

Use the following credentials to test different API responses. Default password for all accounts is `password`.

- **Admin User:** `admin@email.com` - can access all applications
- **Admin User witout Settings page:** `admin_no_settings@email.com` - no access on admin Settings page
- **User redirected to internal page:** `referrer@email.com` – when `redirect.url` is set without the domain,
user shall be redirected to internal page if no location path (referrer) found on the Sign In page
- **User redirected to external page:** `redirect@email.com` – when `redirect.external` and `redirect.url` are set,
user shall be redirected to external page if no location path (referrer) found on the Sign In page
- **Blocked User:** `blocked@email.com` – user is signed in but the account is blocked
- **Unauthorized User:** simply enter wrong `email` and/or `password`
