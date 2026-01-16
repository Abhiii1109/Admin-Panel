# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Update the `.env` file with your settings:

- MongoDB connection string
- Gmail credentials for OTP emails
- Session secret

### Step 3: Start MongoDB

Make sure MongoDB is running on your system.

### Step 4: Create First Admin User

```bash
node seed.js
```

This will create an admin user with:

- **Email**: admin@example.com
- **Password**: Admin@123

### Step 5: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

### Step 6: Login

1. Open browser: http://localhost:3000
2. Login with the credentials above
3. **Important**: Change your password immediately!

## 📋 Default Credentials

**Email**: admin@example.com  
**Password**: Admin@123

⚠️ **Security Note**: Change these credentials immediately after first login!

## 🎯 What's Next?

After logging in, you can:

1. Update your profile (name, email, profile picture)
2. Change your password
3. Create categories
4. Create subcategories
5. Create extra categories
6. Explore the dashboard

## 🔧 Troubleshooting

### MongoDB Connection Error

- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`

### Email Not Sending

- Verify Gmail credentials in `.env`
- Make sure you're using an App Password, not your regular password
- Enable 2-Step Verification in your Google Account

### Port Already in Use

- Change the `PORT` in `.env` to a different number (e.g., 3001)

## 📞 Need Help?

Check the main `README.md` for detailed documentation.

---

**Happy Coding! 🎉**
