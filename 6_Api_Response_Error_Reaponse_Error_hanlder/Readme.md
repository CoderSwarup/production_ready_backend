# Guide: Custom API Response and Error Handling in Production-Level Backend Development

## Unveiling the Art of Crafting Tailored Responses for Seamless Communication

Explore the intricacies of defining custom API responses and error handling to elevate your skills in production-level backend development. Learn how to communicate effectively between servers and clients, ensuring clarity, consistency, and optimal user experience.

# Table Contnet

- [What is Response?](#what-is-response)
- [Types of Response](#types-of-response)
  - [Successful Response](#successful-response)
  - [Error Response](#error-response)
- [Basic Example of Response](#basic-example-of-response)
- [Why We Need Custom Response and Its Advantages](#why-we-need-custom-response-and-its-advantages)
- [Example of Custom API Response](#example-of-custom-api-response)
  - [ApiResponse Class Overview](#apiresponse-class-overview)
  - [ApiError Class Overview](#apierror-class-overview)
- [Async Handler Middleware](#async-handler-middleware)
- [Connect with Me](#connect-with-me)

## What is Response?

In backend development, a "response" is the data sent back to a client after processing a request. It includes information about the request's success or failure and any accompanying data.

## Types of Response

1. **Successful Response:** Sent after processing a request successfully, containing relevant data and a success status code (e.g., HTTP 200).

2. **Error Response:** Sent when there's an issue with the request, including an error message and an appropriate HTTP status code indicating the error type.

## Basic Example of Response

**Successful Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 123,
      "username": "john_doe"
    }
  }
}
```

**Error Response**

```json
{
  "status": "error",
  "message": "Invalid user credentials",
  "code": 401
}
```

# Why We Need The Custom Response and Its Advantages

Custom responses enhance clarity, ease of understanding, and consistency in communication between the server and client.

# Example of Custom Api Response

In this example, a `ApiResponse` class is defined in JavaScript to facilitate the creation of custom API responses. This class simplifies the process of constructing responses with essential components such as status code, data, and a message.

## Class Overview

#### `ApiResponse` Class

The `ApiResponse` class is designed to encapsulate the details of an API response. It takes three parameters during instantiation:

- **`statusCode`:** The HTTP status code indicating the outcome of the API request.
- **`data`:** The payload data to be included in the response, providing essential information.
- **`message` (optional):** A descriptive message associated with the response. It defaults to "Success" but can be customized based on specific scenarios.

Additionally, the class includes a `success` property, which is a boolean indicating whether the response represents a success (status code < 400).

**CODE**

```js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
```

##### Example Usage

```js
// Import the ApiResponse class
import { ApiResponse } from "./path/to/ApiResponse";

// Example 1: Successful Response
const successResponse = new ApiResponse(200, {
  user: { id: 123, username: "john_doe" },
});

// Example 2: Error Response
const errorResponse = new ApiResponse(401, null, "Invalid user credentials");

// Accessing properties of the response
console.log(successResponse.statusCode); // 200
console.log(errorResponse.success); // false
```

#### `ApiError` Class Overview

The `ApiError` class, an extension of the native `Error` class in JavaScript, is a powerful tool for handling and communicating errors in backend development. It provides a structured way to convey error details, including the HTTP status code, error message, and additional information.

- **`statusCode`:** The HTTP status code indicating the nature of the error.
- **`message`:** A descriptive error message providing context about what went wrong.
- **`errors` (optional):** An array containing additional details or multiple errors associated with the request.
- **`stack`:** The error stack trace, capturing the sequence of function calls that led to the error.

**CODE**

```js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
```

##### Example Usage

```javascript
// Import the ApiError class
import { ApiError } from "./path/to/ApiError";

// Example 1: Creating a Generic Error
const genericError = new ApiError(500);

// Example 2: Error with Specific Message and Details
const detailedError = new ApiError(404, "Resource not found", [
  { field: "id", message: "Invalid ID" },
]);

// Accessing properties of the error
console.log(genericError.message); // 'Something went wrong'
console.log(detailedError.errors); // [{ field: 'id', message: 'Invalid ID' }]
```

## Async Handler Middleware

The `asyncHandler` function in JavaScript is a middleware designed to simplify the error handling of asynchronous request handlers in an Express.js application. This middleware wraps around asynchronous route handlers, ensuring proper handling of errors without the need for explicit try-catch blocks.

**CODE**

```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // console.log(err);
      // return next(err);
      if (!err.statusCode) {
        return res.status(500).send({
          error: "SomeThing Is Wrong",
          success: false,
        });
      }
      return res.status(err.statusCode).send({
        error: err.message,
        success: err.success,
      });
    });
  };
};

export { asyncHandler };
```

**_Another Way To Define_**

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};
```

##### Example Usage

```javascript
// Import the asyncHandler middleware
import { asyncHandler } from "./path/to/asyncHandler";

// Example of Usage
const asyncRouteHandler = asyncHandler(async (req, res, next) => {
  // Asynchronous operations, such as database queries or API calls
  const result = await someAsyncOperation();

  // Sending the result in the response
  res.json({ success: true, data: result });
});

// Integrating with an Express route
app.get("/async-route", asyncRouteHandler);
```

## Connect with Me

Stay connected with me for more insights and updates on Production Level Backend Development:

- Linkedin: [![Linkedin](https://img.shields.io/badge/LinkedIn-Swarup%20Bhise-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/swarup-bhise-a981932aa/)

- GitHub: [![GitHub](https://img.shields.io/badge/GitHub-CoderSwarup-blue?style=flat&logo=github)](https://github.com/CoderSwarup)
- Instagram: [![Instagram](https://img.shields.io/badge/Instagram-swarup_bhise999-pink?style=flat&logo=instagram)](https://www.instagram.com/swarup_bhise999/)

Let's embark on a journey to become a skilled backend developer and create amazing web applications.

**Happy Coding!** 🎉
