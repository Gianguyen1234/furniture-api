# Furniture API

The Furniture API provides functionality for managing furniture products, user authentication, orders, reviews, and categories. This RESTful API is built using Node.js, Express.js, and MongoDB. 

## Features

- User Authentication (Register, Login, Token-based authentication with JWT)
- Role-based Access Control (Admin and User roles)
- CRUD operations for furniture products, orders, reviews, and categories

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** for authentication
- **Bcrypt.js** for password hashing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd furniture-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   node server.js
   ```

## Deployment

The API is deployed on Render at:
```
https://furniture-api-1-8h05.onrender.com/
```

## API Endpoints

### Auth Routes
- **POST** `/api/auth/register` - Register a new user
  ```bash
  curl -X POST https://furniture-api-1-8h05.onrender.com/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'
  ```
- **POST** `/api/auth/login` - Login a user
  ```bash
  curl -X POST https://furniture-api-1-8h05.onrender.com/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"email":"john@example.com","password":"123456"}'
  ```

### Product Routes
- **GET** `/api/products` - Get all products
  ```bash
  curl -X GET https://furniture-api-1-8h05.onrender.com/api/products
  ```
- **GET** `/api/products/:id` - Get a product by ID
  ```bash
  curl -X GET https://furniture-api-1-8h05.onrender.com/api/products/<product-id>
  ```
- **POST** `/api/products` - Create a new product (Admin only)
  ```bash
  curl -X POST https://furniture-api-1-8h05.onrender.com/api/products \
       -H "Authorization: Bearer <your-jwt-token>" \
       -H "Content-Type: application/json" \
       -d '{"name":"Table","price":120,"category":"Furniture","description":"A wooden table."}'
  ```
- **PUT** `/api/products/:id` - Update a product (Admin only)
  ```bash
  curl -X PUT https://furniture-api-1-8h05.onrender.com/api/products/<product-id> \
       -H "Authorization: Bearer <your-jwt-token>" \
       -H "Content-Type: application/json" \
       -d '{"name":"Updated Table","price":150}'
  ```
- **DELETE** `/api/products/:id` - Delete a product (Admin only)
  ```bash
  curl -X DELETE https://furniture-api-1-8h05.onrender.com/api/products/<product-id> \
       -H "Authorization: Bearer <your-jwt-token>"
  ```

### Order Routes
- **GET** `/api/orders` - Get all orders
  ```bash
  curl -X GET https://furniture-api-1-8h05.onrender.com/api/orders
  ```
- **POST** `/api/orders` - Create a new order
  ```bash
  curl -X POST https://furniture-api-1-8h05.onrender.com/api/orders \
       -H "Authorization: Bearer <your-jwt-token>" \
       -H "Content-Type: application/json" \
       -d '{"products":[{"productId":"<product-id>","quantity":2}],"total":200}'
  ```

### Review Routes
- **GET** `/api/reviews` - Get all reviews
  ```bash
  curl -X GET https://furniture-api-1-8h05.onrender.com/api/reviews
  ```
- **POST** `/api/reviews` - Add a review
  ```bash
  curl -X POST https://furniture-api-1-8h05.onrender.com/api/reviews \
       -H "Authorization: Bearer <your-jwt-token>" \
       -H "Content-Type: application/json" \
       -d '{"productId":"<product-id>","rating":5,"comment":"Great product!"}'
  ```

### Category Routes
- **GET** `/api/categories` - Get all categories
  ```bash
  curl -X GET https://furniture-api-1-8h05.onrender.com/api/categories
  ```
- **POST** `/api/categories` - Create a new category (Admin only)
  ```bash
  curl -X POST https://furniture-api-1-8h05.onrender.com/api/categories \
       -H "Authorization: Bearer <your-jwt-token>" \
       -H "Content-Type: application/json" \
       -d '{"name":"Chairs"}'
  ```

## Middleware

### Authentication Middleware
Validates JWT tokens to protect private routes.

### Role-based Middleware
Restricts access to specific routes based on the user's role (e.g., Admin).

## Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  createdAt: { type: Date, default: Date.now },
}
```

### Product Model
```javascript
{
  name: String,
  price: Number,
  category: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
}
```

## License
This project is licensed under the MIT License. Feel free to use and modify as needed.
