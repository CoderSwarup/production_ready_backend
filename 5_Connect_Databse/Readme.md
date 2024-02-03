# Connect Database to the Project 📊

In this guide, we'll explore how to connect a database to your production-level backend project. We'll be using MongoDB as the database and the Mongoose library to interact with it. This guide assumes that you have already set up a MongoDB Atlas account or have a local MongoDB server running.

## Prerequisites 🛠️

Ensure you have the necessary packages installed. You can install them using npm:

```bash
npm install dotenv mongoose express
```

## Why These Modules? 🤔

### dotenv:

**Purpose**: dotenv is used to load environment variables from a .env file into process.env. This is crucial for storing sensitive information, such as your MongoDB connection string and server port, securely without hardcoding them in your code.

**Resource**: [dotenv on npm](https://www.npmjs.com/package/dotenv?activeTab=readme)

### mongoose:

**Purpose**: mongoose is an ODM (Object Data Modeling) library for MongoDB. It provides a schema-based solution to model your application data and simplifies interactions with the MongoDB database.

**Resource**: [Mongoose Doc](https://mongoosejs.com/)

### express:

**Purpose**: express is a web application framework for Node.js. It simplifies the process of building robust and scalable web applications by providing a set of features for web and mobile applications.

**Resource**: [express documentation](https://expressjs.com/)

## Project Structure 📂

Your project structure might look something like this:

```lua

project-root
|-- .env
|-- constants.js
|-- db
|   |-- DBConnection.js
|-- index.js
|-- package.json
```

## .env file 🌐

Create a .env file in your project root and add the following:

```plaintext

MONGODB_URL=YOUR_MONGODB_CONNECTION_STRING
PORT=3000
```

Replace YOUR_MONGODB_CONNECTION_STRING with the actual connection string for your MongoDB database.

## index.js 🚀

The main entry point of your application. It sets up the Express server and connects to the database

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DATABSE_NAME } from "./constants.js";
import connectDB from "./db/DBConnection.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//DB CONNECTION
//IIFE () Database connection
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DATABSE_NAME}`);
    // await mongoose.connect(`mongodb://127.0.0.1:27017/${DATABSE_NAME}`)
    app.on("error", (err) => {
      console.log(err);
      throw err;
    });
  } catch (error) {
    console.log("Error ", error);
    throw error;
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## .gitignore 🚫

Add .env to your .gitignore file to ensure sensitive information (like your MongoDB connection string) is not committed to your version control system.

```
.env

```

## Experimental Dotenv 🧪

In your package.json file, you can set up a script to run your server using nodemon and experimental JSON module support with dotenv. This is particularly useful during development.

```js

"scripts": {
    "start": "node src/index.js",
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```

Run your development server using:

```
npm run dev
```

## Connecting to the Database Using a Separate File 🗄️

db/DBConnection.js
Create a separate file for handling database connections.

> > db/DBConnection.js

```js
import mongoose from "mongoose";
import { DATABSE_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DATABSE_NAME}`
    );
    console.log("Data base Connect on : ", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error ", error);
    process.exit(1);
  }
};

export default connectDB;
```

> > index.js

Update your index.js file to use the separate database connection file.

```js
import express from "express";
import connectDB from "./db/DBConnection.js";

// dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This structure allows for better organization and separation of concerns in your codebase, making it easier to maintain and understand.
