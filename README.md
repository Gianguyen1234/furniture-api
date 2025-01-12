# Furniture API

Build with techstack like: Nodejs, express( framework of Node), cors(crossorigin, I have alreaddy published the api and It's open and free for anyone to use). About the database, I'm using mongodb, you can check it at the env file. Finally, for auth, I use JWT to save the token.
The purpose i built this api is for my multiplaform furniture webapp. If you want to see the process of building this project, you can follow my youtube as the name Holy_Dev

## Features

- User Authentication (Register, Login, Token-based authentication with JWT)
- Role-based Access Control (Admin and User roles)
- CRUD operations for furniture products, orders, reviews, and categories
- Unique feature: seach by category name

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
https://furniture-api-i01f.onrender.com/
```

## API Endpoints

Checkout the document on Wiki: [Furniture API Wiki](https://github.com/Gianguyen1234/furniture-api/wiki)

## Middleware

### Authentication Middleware
Validates JWT tokens to protect private routes.

### Role-based Middleware
Restricts access to specific routes based on the user's role (e.g., Admin).


## License
This project is licensed under the MIT License. Feel free to use and modify as needed.
