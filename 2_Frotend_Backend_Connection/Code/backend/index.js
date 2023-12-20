// commonjs
// const express = require("express");

// module Js
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Cors Middleware

// Enable CORS for a specific origin
app.use(cors({ origin: "http://localhost:5173" }));

// Enable CORS for multiple origins
// app.use(cors({ origin: ['http://example1.com', 'http://example2.com'] }));

// Enable CORS with custom headers and methods
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true, // enable set cookie with CORS
//   })
// );

// Enable CORS for a all origin
// app.use(cors({ origin: "*" }));

// Routes

app.get("/", (req, res) => {
  res.send("Server is Working ");
});

app.get("/api/user", (req, res) => {
  const fakeUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
    { id: 4, name: "Alice Williams", email: "alice.williams@example.com" },
    { id: 5, name: "Charlie Brown", email: "charlie.brown@example.com" },
    { id: 6, name: "Eva Davis", email: "eva.davis@example.com" },
    { id: 7, name: "Frank White", email: "frank.white@example.com" },
    { id: 8, name: "Grace Miller", email: "grace.miller@example.com" },
    { id: 9, name: "David Taylor", email: "david.taylor@example.com" },
    { id: 10, name: "Olivia Harris", email: "olivia.harris@example.com" },
  ];

  res.json(fakeUsers);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
