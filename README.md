
# Networker Backend API

Implements the backend web service for the Networker React Native app;

The simplest way to run it locally is using Docker with the supplied docker-compose.yml file

You will also need to configure a .env file, see .env-sample for what is required.

## Database Setup

To initialize the database for use:

Open a shell to the node instance defined by the docker-compose.yml file 

Run the following commands:

```
$ npm run initdb
$ npm run db migrate
```

Optionally if you want to quickly insert a user to login to the app with run `$ npm run seed`; This will prompt for basic user info and create a corresponding record in the database.

