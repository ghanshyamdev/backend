# Simple REST API with Node and OAuth 2.0 with Okta

This example app shows how to create a REST API in Node and secure it with OAuth 2.0 Client Credentials using Okta. This also has an example client written as a CLI that can authenticate with Okta and use the REST API.

## Getting Started

### Technologies used
- Node.js: For serving a set of backend API resources
- Okta: For handling user token based authentication
- sqlite3: For persistent storage file inside the service
- multer: for handling file uploads
- AWS SDK: for handling image uploads

### Environment needed
You need to have node runtime version 8+ in your local machine before you can start the node server. For other third party services, there is already a `.env` file that has the relevant values in it, so you do not need to setup accounts for `okta`, `AWS` or any other services.

### Install Dependencies

After cloning the repository, simply run `npm install` to install the dependencies.

### Run the Backend Server

To run the node.js server, use the command:
```sh
$ npm start
```
Your server will be started in port `3000` at `localhost:3000`

### APIs
|Method | API | Description |
| ------ | ------ | ------ |
|POST | /auth/login | It will handle the user login related service |
|POST | /auth/signup | It will handle the new user registration related service |
|GET | /articles| It will respond with the list of all the articles |
|GET | /articles/page/{page_number}/records/{page_size} | It will handle the list retrieval of the articles based on the page number and size of records in each page |
|POST | /articles/new | It will create the new article |
|DELETE | /articles/{article_id} | It will delete the article |
