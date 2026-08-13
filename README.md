# MERN E-Commerce Platform

A full-stack e-commerce application built with the MERN stack, featuring product management, authentication, categories, shopping cart, order management, payment integration, and an administrative dashboard.

## 🚀 Overview

This project is a complete MERN-based e-commerce platform developed to demonstrate full-stack web development using React.js, Node.js, Express.js, and MongoDB.

The application provides separate functionality for customers and administrators, including authentication, product browsing, shopping cart management, order processing, and product/category administration.

## ✨ Features

### User Features

- User registration and login
- Secure authentication
- Password recovery
- Product browsing
- Product search
- Category-based product filtering
- Product details
- Shopping cart
- Order placement
- Order history
- User profile management
- Responsive user interface
- Theme support

### Admin Features

- Admin authentication
- Administrative dashboard
- User management
- Product management
- Create, update and delete products
- Category management
- Order management
- Product image management
- Carousel management

### Payment

- Braintree payment integration
- Secure checkout workflow
- Order processing

## 🛠️ Technologies Used

### Frontend

- React.js
- React Router
- Axios
- Bootstrap
- Ant Design
- React Icons
- React Hot Toast
- Framer Motion
- AOS
- Moment.js

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt
- Express Formidable
- Morgan
- CORS
- Dotenv

### Payment

- Braintree

### Development Tools

- Git
- GitHub
- Nodemon
- Concurrently

## 🏗️ Architecture

The application follows a client-server architecture:

```text
React.js Frontend
       |
       | REST API
       ▼
Node.js + Express.js Backend
       |
       ▼
MongoDB Database
       |
       ▼
Braintree Payment Gateway