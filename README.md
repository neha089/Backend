# Property Listing System

A scalable backend application for managing property listings, user favorites, and personalized recommendations, built for the SDE Backend Intern assignment. Deployed on Render, it uses MongoDB for data storage and Upstash Redis for caching.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)


## Overview
The Property Listing System is a RESTful API that enables users to register, manage property listings, save favorites, and receive personalized property recommendations. It supports CSV data import for bulk property uploads and uses Redis caching for performance optimization. The root endpoint (`GET /`) provides JSON documentation of all APIs.

## Features
- **User Authentication**: Register and log in users with JWT-based authentication.
- **Property Management**: Create, read, update, and delete (CRUD) property listings with filters (e.g., city, price).
- **Favorites**: Allow users to bookmark properties.
- **Recommendations**: Generate personalized property suggestions based on user favorites and search history.
- **Sharing**: Share properties with other users via email.
- **CSV Import**: Import property data from CSV files.
- **Caching**: Use Upstash Redis to cache property and recommendation queries.
- **API Documentation**: JSON-based API details available at `GET /`.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB Atlas
- **Caching**: Upstash Redis
- **Authentication**: JSON Web Tokens (JWT)
- **Rate Limiting**: Express Rate Limit
- **Logging**: Winston
- **Deployment**: Render
- **Other**: Mongoose, ioredis, express-validator

## API Documentation
The `GET /` endpoint returns a JSON object listing all APIs, their methods, paths, descriptions, inputs, and outputs. Below is a summary of the APIs:

### Auth Routes
- **POST /auth/register**
  - **Description**: Register a new user.
  - **Inputs**:
    - **Body**: `{ "email": "string", "password": "string", "name": "string" }`
    - **Headers**: `Content-Type: application/json`
  - **Outputs**:
    - **201**: `{ "user": { "_id": "string", "email": "string", "name": "string" }, "token": "string" }`
    - **400**: `{ "error": "Email already exists" }`
- **POST /auth/signin**
  - **Description**: Log in a user and return JWT token.
  - **Inputs**:
    - **Body**: `{ "email": "string", "password": "string" }`
    - **Headers**: `Content-Type: application/json`
  - **Outputs**:
    - **200**: `{ "token": "string", "user": { "_id": "string", "email": "string", "name": "string" } }`
    - **401**: `{ "error": "Invalid credentials" }`

### Property Routes
- **GET /properties**
  - **Description**: Retrieve properties with optional filters.
  - **Inputs**:
    - **Query**: `city=string`, `price=number`, etc.
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "properties": [{ "_id": "string", "id": "string", "title": "string", "city": "string", "price": number, ... }] }`
    - **401**: `{ "error": "Unauthorized" }`
- **POST /properties**
  - **Description**: Create a new property.
  - **Inputs**:
    - **Body**: `{ "id": "string", "title": "string", "type": "string", "price": number, "city": "string", "state": "string", "bedrooms": number, "bathrooms": number, "amenities": ["string"], "tags": ["string"], "listingType": "string" }`
    - **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
  - **Outputs**:
    - **201**: `{ "_id": "string", "id": "string", "title": "string", ... }`
    - **400**: `{ "error": "Invalid input" }`
- **PUT /properties/:id**
  - **Description**: Update a property by ID.
  - **Inputs**:
    - **Params**: `id` (property ID)
    - **Body**: `{ "title": "string", "price": number, ... }` (partial)
    - **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
  - **Outputs**:
    - **200**: Updated property object
    - **404**: `{ "error": "Property not found" }`
- **DELETE /properties/:id**
  - **Description**: Delete a property by ID.
  - **Inputs**:
    - **Params**: `id`
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "message": "Property deleted" }`
    - **404**: `{ "error": "Property not found" }`

### Favorite Routes
- **POST /favorites**
  - **Description**: Add a property to user’s favorites.
  - **Inputs**:
    - **Body**: `{ "propertyId": "string" }`
    - **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
  - **Outputs**:
    - **201**: `{ "favorite": { "_id": "string", "userId": "string", "propertyId": "string" } }`
    - **400**: `{ "error": "Invalid property ID" }`
- **GET /favorites**
  - **Description**: List user’s favorite properties.
  - **Inputs**:
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "favorites": [{ "_id": "string", "userId": "string", "propertyId": "string" }] }`
    - **401**: `{ "error": "Unauthorized" }`
- **DELETE /favorites/:propertyId**
  - **Description**: Remove a property from favorites.
  - **Inputs**:
    - **Params**: `propertyId`
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "message": "Favorite removed" }`
    - **404**: `{ "error": "Favorite not found" }`

### Recommendation Routes
- **GET /recommendations**
  - **Description**: Get personalized property recommendations.
  - **Inputs**:
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "recommendations": [{ "_id": "string", "id": "string", "title": "string", "city": "string", ... }] }`
    - **500**: `{ "error": "Server error" }`
- **POST /recommendations/share**
  - **Description**: Share a property with another user.
  - **Inputs**:
    - **Body**: `{ "recipientEmail": "string", "propertyId": "string" }`
    - **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
  - **Outputs**:
    - **201**: `{ "recommendation": { "_id": "string", "senderId": "string", "recipientId": "string", "propertyId": "string" } }`
    - **400**: `{ "error": "Recipient not found" }`
- **GET /recommendations/shared**
  - **Description**: List properties shared with the user.
  - **Inputs**:
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "recommendations": [{ "_id": "string", "senderId": { "email": "string", "name": "string" }, "propertyId": { "_id": "string", "title": "string" } }] }`
    - **500**: `{ "error": "Server error" }`
- **GET /recommendations/search**
  - **Description**: Search users by email for sharing.
  - **Inputs**:
    - **Query**: `email=string`
    - **Headers**: `Authorization: Bearer <token>`
  - **Outputs**:
    - **200**: `{ "users": [{ "_id": "string", "email": "string", "name": "string" }] }`
    - **400**: `{ "error": "Email query required" }`

Visit the root endpoint (`GET /`) for the full JSON documentation.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/property-listing-system.git
   cd property-listing-system
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://root:1234@backend.y6y0zgz.mongodb.net/propertyDB
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://default:...@super-lion-41611.upstash.io:6379
   RENDER_URL=http://localhost:3000
   ```
4. **Build and Run**:
   ```bash
   npm run build
   npm start
   ```
5. **Access the API**:
   - Local: `http://localhost:3000/`
   - Deployed: `https://property-listing-system.onrender.com/`

## Deployment
- **Platform**: Render
- **URL**: `https://property-listing-system.onrender.com/`
- **Database**: MongoDB Atlas
- **Caching**: Upstash Redis
- **Environment Variables**:
  - Set `MONGODB_URI`, `JWT_SECRET`, `REDIS_URL`, `RENDER_URL` in Render Dashboard.
- **Deployment Steps**:
  1. Push code to GitHub.
  2. Connect repository to Render.
  3. Configure environment variables.
  4. Trigger deployment.



