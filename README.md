# 🛒 MERN E-Commerce Platform

A full-stack, production-style **MERN E-Commerce Platform** built with **React.js, Node.js, Express.js, and MongoDB**, featuring customer shopping workflows, secure authentication, Braintree payments, inventory management, order lifecycle management, product reviews, favourites, transaction history, invoices, and a comprehensive admin analytics dashboard.


## 🚀 Overview

This project is a complete full-stack e-commerce application designed to demonstrate modern web development practices across both customer-facing and administrative workflows.

The platform provides separate experiences for **customers and administrators**, covering the complete journey from product discovery and cart management to payment processing, inventory reservation, order management, reviews, and business analytics.

The application also includes a responsive interface with **light/dark theme support** and reusable React components for maintaining a scalable frontend architecture.


## ✨ Key Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication
* Password recovery
* User profile management
* Responsive customer dashboard
* Product browsing
* Product search
* Category-based filtering
* Product details
* Related products
* Shopping cart management
* Duplicate cart item quantity handling
* Stock availability validation
* Favourite products
* Order placement
* Order history
* Order invoice generation
* Product reviews and ratings
* Purchased-product review validation
* Review deletion for authorized users
* Responsive UI
* Light/Dark theme support
* Toast notifications and interactive UI feedback


### 🛍️ Product & Shopping Features

* Product listing and browsing
* Product search
* Category filtering
* Product details
* Related products
* Product image management
* Product quantity / inventory tracking
* Real-time stock validation during checkout
* Cart quantity management
* Persistent cart using local storage
* Favourite products
* Product ratings and review counts
* Customer reviews
* Historical product pricing stored with orders


### 💳 Payment & Checkout

* **Braintree payment integration**
* Secure checkout workflow
* Payment nonce processing
* Server-side payment validation
* Inventory reservation before payment completion
* Automatic stock restoration when payment fails
* Automatic stock restoration when order creation fails
* Refund handling when required after payment/order failure
* Successful payment tracking
* Failed payment attempt tracking
* Transaction IDs for successful payments
* Shipping configuration

### 🔐 Payment & Inventory Flow

Customer Checkout
       │
       ▼
Validate Cart
       │
       ▼
Reserve Product Stock
       │
       ▼
Process Braintree Payment
       │
       ├───────────────┐
       │               │
    Success          Failure
       │               │
       ▼               ▼
Create Order      Restore Stock
       │
       ▼
Clear Cart

This prevents overselling by reserving inventory atomically before completing the payment workflow.


# 📦 Order Management

The platform implements a complete order lifecycle:

Not Process
     ↓
Processing
     ↓
Shipped
     ↓
delivered

Orders can also be:

cancel

### Order Features

* Order creation
* Order history
* Admin order management
* Order status management
* Payment status validation
* Order cancellation
* Inventory restoration after cancellation
* Inventory validation when reopening a cancelled order
* Permanent transaction history
* Individual order details
* Customer invoice generation
* Historical purchase price preservation

### Inventory Restoration

When an order is cancelled, the purchased quantity is automatically returned to product inventory.

When a cancelled order is reopened, the system checks current inventory before reducing stock again.

Order Cancelled
      ↓
Restore Purchased Quantity
      ↓
Product Stock Increased


# 🧾 Transaction History & Invoices

The platform includes a dedicated transaction history system for maintaining permanent order records.

### Transaction History

* Complete order history
* Customer information
* Purchased products
* Purchase-time product prices
* Quantities
* Payment information
* Order status
* Creation date
* Sorted transaction records

### Invoice

Each order can be viewed through a dedicated invoice page containing:

* Customer information
* Order information
* Purchased products
* Quantity
* Historical purchase price
* Individual item totals
* Final order total
* Payment information
* Order status
* Printable invoice layout

> Historical invoices use the price stored at the time of purchase rather than the product's current price.


# ⭐ Product Reviews & Ratings

The platform includes a reusable review and rating system.

### Review Features

* 1–5 star ratings
* Customer comments
* One review per user per product
* Purchase-based review authorization
* Successful-payment verification
* Cancelled orders excluded from review eligibility
* Review deletion by the review owner
* Admin review deletion
* Automatic product rating recalculation
* Automatic review count updates
* Reusable review components

### Review Architecture

Product
 ├── averageRating
 └── reviewCount

Review
 ├── product
 ├── user
 ├── rating
 └── comment

Product cards display the stored rating summary without making separate review API requests.

Detailed reviews are loaded on the product details page through a reusable:

ReviewsSection
 ├── ReviewSummary
 ├── ReviewForm
 └── ReviewList


# ❤️ Favourite Products

Customers can save products to their favourites.

### Features

* Add product to favourites
* Remove product from favourites
* Favourite status across product browsing interfaces
* Dedicated favourites page
* Reusable `FavouriteButton` component

The favourite functionality is designed as a reusable frontend feature so the same interaction can be used across different product displays.


# 📊 Admin Dashboard & Analytics

The administrative dashboard provides an overview of the store's operational and sales activity.

### Analytics Categories

#### 💰 Sales

* Total sales
* Today's sales
* Weekly sales
* Monthly sales
* Average order value
* Revenue trends

#### 📦 Orders

* Total orders
* Not Process
* Processing
* Shipped
* Delivered
* Cancelled orders

#### 👥 Customers

* Total customers
* New customers
* Customers with orders

#### 🛍️ Products

* Total products
* Out-of-stock products
* Low-stock products
* Best-selling products

#### 💳 Payments

* Successful payments
* Failed payment attempts
* Revenue
* Payment activity

#### 👁️ Visits

* Total visits
* Today's visits
* Unique visitors
* Visit trends over time

#### 🧾 Recent Activity

* Recent orders
* Order status
* Customer information
* Payment information

---

## 📈 Analytics Periods

The admin can analyze chart-based data using:

* Last 7 Days
* Last 30 Days
* This Month

The dashboard also provides fixed KPI values for:

* Today
* Current Week
* Current Month


# 📋 Admin Features

### Dashboard

* Store overview
* Sales analytics
* Order analytics
* Customer statistics
* Product statistics
* Payment statistics
* Visitor analytics
* Recent orders
* Low-stock indicators
* Out-of-stock indicators

### Product Management

* Create products
* Update products
* Delete products
* Product image management
* Inventory management
* Product quantity tracking
* Category assignment

### Category Management

* Create categories
* Update categories
* Delete categories
* Category-based product organization

### Order Management

* View orders
* Update order status
* Cancel orders
* Reopen cancelled orders
* Inventory restoration
* Inventory availability validation
* View transaction history
* View invoices

### User Management

* User administration
* Customer information management
* Role-based administrative access

### Carousel Management

* Create carousel content
* Update carousel content
* Delete carousel content
* Manage homepage promotional content


# 🔐 Authentication & Authorization

The application uses JWT-based authentication with role-based access control.

### Authentication

* User registration
* User login
* JWT authentication
* Protected routes
* Password recovery
* Role-based authorization

### Roles

Customer
   │
   └── Customer Dashboard
       ├── Orders
       ├── Profile
       ├── Favourites
       └── Shopping Features

Admin
   │
   └── Admin Dashboard
       ├── Analytics
       ├── Products
       ├── Categories
       ├── Orders
       ├── Users
       ├── Transactions
       └── Management Tools

Passwords are handled using **Bcrypt**, while protected API endpoints use JWT authentication and authorization middleware.


# 🏗️ Architecture

The application follows a client-server architecture:

┌───────────────────────────┐
│       React Frontend      │
│                           │
│  Components / Pages       │
│  Context / State          │
│  React Router             │
│  Axios                    │
└─────────────┬─────────────┘
              │
              │ REST API
              ▼
┌───────────────────────────┐
│    Node.js + Express      │
│                           │
│ Controllers               │
│ Routes                    │
│ Middleware                │
│ Authentication            │
│ Business Logic            │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│         MongoDB           │
│                           │
│ Users                     │
│ Products                  │
│ Categories                │
│ Orders                    │
│ Reviews                   │
│ Payment Attempts          │
│ Visits                    │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│      Braintree API        │
│                           │
│ Payment Processing        │
│ Transaction Handling      │
└───────────────────────────┘


# 🧩 Frontend Architecture

The React frontend uses reusable components and shared application contexts to reduce duplication and maintain consistency.

Example reusable architecture:

Product Card
 ├── FavouriteButton
 └── ReviewSummary

Product Details
 ├── FavouriteButton
 ├── Product Information
 ├── ReviewSummary
 └── ReviewsSection
       ├── ReviewForm
       └── ReviewList

This allows common functionality to be reused across:

* Home
* Search
* Category pages
* Related products
* Product details
* User dashboard


# 🎨 UI & UX

The application focuses on a responsive and consistent user experience.

### UI Features

* Responsive design
* Desktop / tablet / mobile support
* Light mode
* Dark mode
* Responsive admin dashboard
* Responsive customer dashboard
* Bootstrap components
* Ant Design components
* React Icons
* Toast notifications
* Animated UI interactions
* AOS animations
* Framer Motion animations
* Interactive forms
* Printable invoice design


# 🛠️ Technologies Used

## Frontend

| Technology      | Purpose                |
| --------------- | ---------------------- |
| React.js        | Frontend application   |
| React Router    | Client-side routing    |
| Axios           | REST API communication |
| Bootstrap       | Responsive UI          |
| Ant Design      | UI components          |
| React Icons     | Interface icons        |
| React Hot Toast | Notifications          |
| Framer Motion   | UI animations          |
| AOS             | Scroll animations      |
| Moment.js       | Date/time formatting   |


## Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Backend runtime            |
| Express.js         | REST API framework         |
| MongoDB            | Database                   |
| Mongoose           | MongoDB ODM                |
| JWT                | Authentication             |
| Bcrypt             | Password hashing           |
| Express Formidable | Request/file handling      |
| Morgan             | HTTP request logging       |
| CORS               | Cross-origin communication |
| Dotenv             | Environment configuration  |


## Payment

| Technology | Purpose            |
| ---------- | ------------------ |
| Braintree  | Payment processing |

---

## Development Tools

| Tool         | Purpose                           |
| ------------ | --------------------------------- |
| Git          | Version control                   |
| GitHub       | Source code hosting               |
| Nodemon      | Backend development               |
| Concurrently | Running frontend/backend together |

---

# 📁 Core Data Models

The current application uses dedicated models for major business entities:

User
 ├── Authentication
 ├── Role
 ├── Profile
 └── Orders / Reviews / Favourites

Product
 ├── Name
 ├── Price
 ├── Quantity
 ├── Category
 ├── Image
 ├── Average Rating
 └── Review Count

Category
 └── Product Organization

Order
 ├── Buyer
 ├── Products
 ├── Quantity
 ├── Purchase-time Price
 ├── Payment
 └── Status

Review
 ├── Product
 ├── User
 ├── Rating
 └── Comment

PaymentAttempt
 ├── Buyer
 ├── Amount
 ├── Success
 ├── Transaction ID
 └── Payment Message

Visit
 ├── Visitor ID
 ├── User
 ├── IP
 ├── User Agent
 └── Path

---

# 🔄 Order & Inventory Design

One of the important parts of the application is its inventory-aware order workflow.

### Successful Checkout

Cart
 ↓
Group duplicate products
 ↓
Validate stock
 ↓
Atomically reserve stock
 ↓
Process payment
 ↓
Create order
 ↓
Clear cart

### Failed Payment

Cart
 ↓
Reserve stock
 ↓
Payment fails
 ↓
Restore stock
 ↓
Record payment attempt

### Order Cancellation

Existing Order
 ↓
Admin cancels order
 ↓
Restore ordered quantities
 ↓
Product inventory updated

### Reopening Cancelled Order

Cancelled Order
 ↓
Check current stock
 ↓
Enough stock?
 ├── Yes → Reduce stock → Reopen
 └── No  → Reject reopening

---

# 📊 Analytics Data Design

Analytics are generated from actual application data rather than relying only on frontend calculations.

The analytics system combines information from:

Orders
Payment Attempts
Users
Products
Visits


Revenue calculations use the **purchase-time price stored inside each order item**, ensuring historical transaction values remain accurate even if a product's current price changes later.

---

# 🔒 Environment Variables

Create a `.env` file in the backend according to your local configuration.

Example:

PORT=8080

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key


> Never commit real credentials, API keys, database connection strings, or secrets to GitHub.

---

# 🚀 Running the Project Locally

### 1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL


### 2. Install dependencies

Backend:

cd backend
npm install

Frontend:

cd frontend
npm install

### 3. Configure environment variables

Create the required `.env` file in the backend and add your MongoDB, JWT, and Braintree credentials.

### 4. Start the application

Backend:

npm run server

Frontend:

npm start


If your project uses `concurrently`, both services can be started through the configured development script.

---

# 🌐 Application Structure

MERN E-Commerce Platform
│
├── Customer Application
│   ├── Authentication
│   ├── Products
│   ├── Search
│   ├── Categories
│   ├── Cart
│   ├── Favourites
│   ├── Reviews
│   ├── Checkout
│   ├── Orders
│   ├── Invoices
│   └── Profile
│
└── Admin Application
    ├── Dashboard
    ├── Analytics
    ├── Products
    ├── Categories
    ├── Users
    ├── Orders
    ├── Transactions
    ├── Reviews
    └── Carousel Management


---

# 🎯 Project Goals

This project was developed to demonstrate practical full-stack development skills including:

* REST API development
* React application architecture
* MongoDB data modeling
* Authentication and authorization
* Payment gateway integration
* Inventory management
* Order lifecycle management
* Transaction handling
* Business analytics
* Reusable component design
* Responsive UI development
* State management
* Error handling
* API integration
* Database aggregation
* Real-world e-commerce workflows

---

# 📌 Project Highlights

### Full-Stack

React.js + Node.js + Express.js + MongoDB

### Payment

Braintree checkout with inventory-aware payment processing

### Inventory

Atomic stock reservation, restoration, cancellation, and reopening validation

### Orders

Complete order lifecycle with permanent transaction history and invoices

### Reviews

Purchase-based reviews with ratings and automatic aggregation

### Favourites

Reusable favourite functionality across product interfaces

### Analytics

Sales, orders, customers, products, payments, and visitor analytics

### UI

Responsive light/dark customer and admin interfaces

---

## 👨‍💻 Developer

**Ansar Mehmood**

Full-Stack / MERN Developer

Built as a full-stack portfolio project to demonstrate practical experience with modern web application development, REST APIs, MongoDB, authentication, payment integration, inventory systems, and administrative dashboards.

---

## 📄 License

This project is developed for portfolio and educational purposes.
