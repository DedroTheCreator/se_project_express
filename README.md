## Deployed Application

Backend domain:
https://api.darriuswtwr.com

Frontend domain:
https://darriuswtwr.com

Frontend repository:
https://github.com/DedroTheCreator/se_project_react


# WTWR — What To Wear (Backend API)

## 📌 Overview
WTWR (What To Wear) is a backend REST API built to support a full-stack application that helps users decide what to wear based on current weather conditions while managing a personal digital wardrobe.

This backend handles user authentication, clothing item management, likes, and secure data access. It is designed to be scalable, secure, and production-ready, and is connected to a React frontend.

---

## 🎯 Project Goals
- Build a secure RESTful API using Node.js and Express
- Implement user authentication and authorization
- Support full CRUD operations for users and clothing items
- Apply best practices for validation, error handling, and logging
- Deploy a production-ready backend service

---

## 🛠 Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Celebrate & Joi (request validation)
- Winston (logging)
- PM2 (process management)
- Nginx (reverse proxy)
- SSL (HTTPS)

---

## ⚙️ Functionality
- User registration and login with hashed passwords
- JWT-based authentication and protected routes
- Create, read, update, and delete clothing items
- Like and unlike clothing items
- User profile management
- Centralized error handling with custom error classes
- Request validation to ensure API reliability and security
- Logging for debugging and monitoring

---

## 🗂 API Structure
- **Users**
  - Sign up
  - Log in
  - Get current user
  - Update profile information
- **Clothing Items**
  - Add new item
  - Delete item (owner only)
  - Like / Unlike item
  - Retrieve all items

---

## 🖼 Screenshots / Demo
_Add screenshots of:_
- API routes tested in Postman
- Successful authentication responses
- Error handling examples
