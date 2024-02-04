# Building Secure and Scalable Backend Systems: Understanding Refresh Tokens and Access Tokens

## Overview

Welcome to our comprehensive tutorial series on building a production-level backend. In this installment, we delve into the crucial concepts of Refresh Tokens and Access Tokens, providing a deep understanding of their role in securing and managing user authentication in web applications.

## Table of Contents

1. [What Tokens](#what-tokens)
2. [What is Refresh Token](#what-is-refresh-token)
3. [What is Access Token](#what-is-access-token)
4. [Why We Need Two Tokens](#why-we-need-two-tokens)
5. [What is JSON Web Token](#what-is-json-web-token)
6. [Code For Implementing Token-based Authentication in Express.js](#code-for-implementing-token-based-authentication-in-expressjs)
7. [Connect with Me](#connect-with-me)

## What Tokens

Tokens play a pivotal role in modern authentication systems. They are cryptographic strings issued by an authentication server to authenticate users and grant them access to protected resources.

## What is Refresh Token

A Refresh Token is a long-lived token used to obtain a new Access Token after the original token expires. It enhances security by reducing the frequency of exposing the Access Token.

## What is Access Token

An Access Token is a short-lived token that grants access to specific resources on behalf of a user. It is presented to the server when making requests for protected resources.

## Why We Need Two Tokens

Using two tokens, Refresh Token and Access Token, adds an extra layer of security. The Access Token has a shorter lifespan, reducing the risk of unauthorized access.

## What is JSON Web Token

JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is often used for authentication and authorization purposes.

[Read More About JWT](https://jwt.io/)

# Code For Implementing Token-based Authentication in Express.js

**Install Dependency**

```bash
npm install jsonwebtoken express
```

**Code**

```js
// Import required modules
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser"); // Import body-parser

// Create an Express app
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());
// Accept Json MiddleWare
app.use(
  express.json({
    limit: "16kb",
  })
);

// Secret keys for signing and verifying the tokens
const accessTokenSecret = "yourAccessTokenSecret";
const refreshTokenSecret = "yourRefreshTokenSecret";

// Middleware to verify access token
const verifyAccessToken = (req, res, next) => {
  // Get access token from request headers
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  // Verify the access token
  jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Failed to authenticate access token" });
    }

    // Attach the decoded payload to the request object
    req.user = decoded;
    next();
  });
};

// Route to generate access token
app.post("/getTokens", (req, res) => {
  // User information (replace with your actual user data)
  const user = {
    id: 1,
    username: "john_doe",
  };

  // Generate an access token with a payload (user information) and sign it
  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: "15m" });

  // Generate a refresh token with a payload (user information) and sign it
  const refreshToken = jwt.sign(user, refreshTokenSecret, { expiresIn: "7d" });

  res.json({ accessToken, refreshToken });
});

// Route to refresh access token using refresh token
app.post("/refreshToken", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Failed to authenticate refresh token" });
    }

    // Generate a new access token with the same payload and sign it
    const newAccessToken = jwt.sign(decoded, accessTokenSecret, {
      expiresIn: "15m",
    });

    res.json({ accessToken: newAccessToken });
  });
});

// Protected route that requires a valid access token
app.get("/protectedRoute", verifyAccessToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Connect with Me

Stay connected with me for more insights and updates on Production Level Backend Development:

- Linkedin: [![Linkedin](https://img.shields.io/badge/LinkedIn-Swarup%20Bhise-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/swarup-bhise-a981932aa/)

- GitHub: [![GitHub](https://img.shields.io/badge/GitHub-CoderSwarup-blue?style=flat&logo=github)](https://github.com/CoderSwarup)

- Instagram: [![Instagram](https://img.shields.io/badge/Instagram-swarup_bhise999-pink?style=flat&logo=instagram)](https://www.instagram.com/swarup_bhise999/)

Let's embark on a journey to become a skilled backend developer and create amazing web applications.

**Happy Coding!** 🎉
