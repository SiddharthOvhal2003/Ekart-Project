# 🛒 EKART - Full Stack E-Commerce Platform

EKART is a modern full-stack e-commerce web application built using the MERN stack. The platform allows users to browse products, manage their cart, place orders, and complete secure online payments. It also includes an admin dashboard for managing products, users, and orders.

---

## 🚀 Features

### User Features

* User Registration & Login
* JWT Authentication
* Role-Based Authorization
* Browse Products
* Product Search & Filtering
* Shopping Cart Management
* Secure Checkout
* Razorpay Payment Integration
* Order Tracking
* User Profile Management

### Admin Features

* Admin Dashboard
* Product Management (Create, Update, Delete)
* User Management
* Order Management
* Inventory Control

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer

### Database

* MongoDB
* Mongoose

### Cloud & Payment Services

* Cloudinary
* Razorpay

---

## 📂 Project Structure

```bash
EKART/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/EKART.git
cd EKART
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd ../backend
npm install
```

### Create Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Run Backend

```bash
npm run dev
```

### Run Frontend

```bash
cd frontend
npm run dev
```

---

## 🔐 Authentication

* JWT Based Authentication
* Protected Routes
* Role-Based Access Control
* Secure Password Hashing

---

## ☁️ Image Upload

Product images are uploaded and managed using Cloudinary.

---

## 💳 Payment Gateway

Secure payment processing is implemented using Razorpay.

---

## 📈 Future Enhancements

* Wishlist Functionality
* Product Reviews & Ratings
* Coupon System
* Email Notifications
* Real-Time Order Updates
* AI Product Recommendations

---

## 👨‍💻 Author

**Siddharth Ovhal**

Computer Engineering Student | MERN Stack Developer

---

⭐ If you found this project useful, consider giving it a star on GitHub.
