# Admin Panel Management System

A complete, production-ready Admin Panel Management System built with **Node.js**, **Express.js**, and **MongoDB** following strict **MVC architecture**. This system features secure authentication, OTP-based password reset, comprehensive CRUD operations, and a clean, professional UI.

## 🚀 Features

### Authentication & Security

- ✅ Admin login with session-based authentication
- ✅ Password hashing using bcrypt
- ✅ OTP-based password reset (5-minute expiry)
- ✅ Email notifications via Nodemailer
- ✅ Protected routes with authentication middleware
- ✅ Change password functionality

### Dashboard

- ✅ Statistics cards (Categories, Subcategories, Extra Categories)
- ✅ Recent activities display
- ✅ Quick action buttons

### Category Management (CRUD)

- ✅ Create, Read, Update, Delete categories
- ✅ Active/Inactive status
- ✅ Input validation

### Subcategory Management (CRUD)

- ✅ Create, Read, Update, Delete subcategories
- ✅ Category relationship (ObjectId reference)
- ✅ Dynamic category selection

### Extra Category Management (CRUD)

- ✅ Create, Read, Update, Delete extra categories
- ✅ Nested relationships (Category → Subcategory)
- ✅ Dynamic subcategory loading based on category
- ✅ Populated data display using Mongoose populate()

### Profile Management

- ✅ View admin profile
- ✅ Update profile (name, email, profile image)
- ✅ Image upload using Multer
- ✅ Change password with validation

### Flash Messages

- ✅ Success/Error messages
- ✅ Auto-dismiss after 5 seconds
- ✅ Global flash middleware

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS
- **Authentication**: Express Session
- **Password Hashing**: bcrypt
- **Email**: Nodemailer
- **File Upload**: Multer
- **Validation**: express-validator
- **Flash Messages**: connect-flash
- **Environment Variables**: dotenv

## 📁 Project Structure

```
/admin-panel
│── /config
│   ├── db.js              # Database connection
│   ├── mail.js            # Email configuration
│
│── /controllers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── categoryController.js
│   ├── subcategoryController.js
│   ├── extraCategoryController.js
│   ├── profileController.js
│
│── /models
│   ├── Admin.js
│   ├── Category.js
│   ├── Subcategory.js
│   ├── ExtraCategory.js
│
│── /routes
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── categoryRoutes.js
│   ├── subcategoryRoutes.js
│   ├── extraCategoryRoutes.js
│   ├── profileRoutes.js
│
│── /middlewares
│   ├── authMiddleware.js
│   ├── flashMiddleware.js
│
│── /views
│   ├── /layouts
│   ├── /auth
│   ├── /dashboard
│   ├── /category
│   ├── /subcategory
│   ├── /extra-category
│   ├── /profile
│
│── /public
│   ├── /css
│   ├── /js
│   ├── /images
│   ├── /uploads
│
│── app.js
│── server.js
│── .env
│── package.json
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for sending OTP emails)

### Step 1: Clone or Download

```bash
cd admin-panel
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/admin-panel

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OTP Configuration
OTP_EXPIRY_MINUTES=5
```

### Step 4: Setup Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password for "Mail"
4. Use this app password in `EMAIL_PASS`

### Step 5: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### Step 6: Run the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Step 7: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 👤 Creating First Admin User

Since there's no public registration, you need to create the first admin user manually in MongoDB:

### Method 1: Using MongoDB Compass or Shell

```javascript
use admin-panel

db.admins.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2b$10$YourHashedPasswordHere", // Use bcrypt to hash
  profileImage: null,
  resetOTP: null,
  otpExpiry: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 2: Create a Seed Script

Create a file `seed.js` in the root:

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

const createAdmin = async () => {
  await connectDB();

  const admin = await Admin.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123", // Will be hashed automatically
  });

  console.log("Admin created:", admin.email);
  process.exit(0);
};

createAdmin();
```

Run it:

```bash
node seed.js
```

## 🎨 UI/UX Design

The admin panel features a **clean, minimal, and professional design**:

- **Color Palette**: Neutral grays with indigo accent
- **Typography**: System fonts for optimal performance
- **Layout**: Fixed sidebar with responsive header
- **Components**: Cards, tables, forms, badges, buttons
- **Animations**: Smooth transitions and hover effects
- **Flash Messages**: Auto-dismissing notifications
- **Responsive**: Mobile-friendly design

## 🔐 Password Requirements

Passwords must meet the following criteria:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (@$!%\*?&)

## 📧 Email Configuration

The system uses Nodemailer to send OTP emails. Make sure to:

1. Use a valid Gmail account
2. Enable 2-Step Verification
3. Generate an App Password
4. Update `.env` with credentials

## 🗄️ Database Schema

### Admin

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profileImage: String,
  resetOTP: String,
  otpExpiry: Date,
  timestamps: true
}
```

### Category

```javascript
{
  name: String (unique),
  status: String (Active/Inactive),
  timestamps: true
}
```

### Subcategory

```javascript
{
  name: String,
  categoryId: ObjectId (ref: Category),
  timestamps: true
}
```

### ExtraCategory

```javascript
{
  name: String,
  categoryId: ObjectId (ref: Category),
  subcategoryId: ObjectId (ref: Subcategory),
  timestamps: true
}
```

## 🚦 Routes

### Authentication Routes

- `GET /auth/login` - Login page
- `POST /auth/login` - Login handler
- `GET /auth/logout` - Logout
- `GET /auth/forgot-password` - Forgot password page
- `POST /auth/forgot-password` - Send OTP
- `GET /auth/verify-otp` - OTP verification page
- `POST /auth/verify-otp` - Verify OTP
- `GET /auth/reset-password` - Reset password page
- `POST /auth/reset-password` - Reset password handler

### Dashboard Routes

- `GET /dashboard` - Dashboard page

### Category Routes

- `GET /category` - List categories
- `GET /category/create` - Create form
- `POST /category/create` - Create handler
- `GET /category/edit/:id` - Edit form
- `POST /category/edit/:id` - Update handler
- `POST /category/delete/:id` - Delete handler

### Subcategory Routes

- `GET /subcategory` - List subcategories
- `GET /subcategory/create` - Create form
- `POST /subcategory/create` - Create handler
- `GET /subcategory/edit/:id` - Edit form
- `POST /subcategory/edit/:id` - Update handler
- `POST /subcategory/delete/:id` - Delete handler
- `GET /subcategory/api/by-category/:categoryId` - API endpoint

### Extra Category Routes

- `GET /extra-category` - List extra categories
- `GET /extra-category/create` - Create form
- `POST /extra-category/create` - Create handler
- `GET /extra-category/edit/:id` - Edit form
- `POST /extra-category/edit/:id` - Update handler
- `POST /extra-category/delete/:id` - Delete handler

### Profile Routes

- `GET /profile` - View profile
- `GET /profile/edit` - Edit profile form
- `POST /profile/edit` - Update profile
- `GET /profile/change-password` - Change password form
- `POST /profile/change-password` - Change password handler

## 🛡️ Security Features

- Password hashing with bcrypt (10 salt rounds)
- Session-based authentication
- Protected routes with middleware
- OTP expiry (5 minutes)
- Input validation on both frontend and backend
- File upload restrictions (size, type)
- CSRF protection (via session)

## 📝 License

ISC

## 👨‍💻 Author

Created as a production-ready admin panel template.

## 🙏 Acknowledgments

Built with modern web development best practices and MVC architecture principles.

---

**Note**: This is a complete, fully functional admin panel ready for production use. Make sure to update the `.env` file with your actual credentials before deploying.
