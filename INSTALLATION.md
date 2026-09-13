# College Resource Hub - Installation Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd college-resource-hub
```

### Step 2: Install Dependencies
**Option A: Automatic Setup (Windows)**
```bash
setup.bat
```

**Option B: Manual Setup**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-resource-hub
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-different-from-above
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Cloudinary Configuration (Required for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 4: Setup Cloudinary (Required)

1. **Create Account**: Go to [cloudinary.com](https://cloudinary.com) and sign up
2. **Get Credentials**: From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. **Add to .env**: Paste these values in your `.env` file

### Step 5: Setup Database

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Database will be created automatically

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env` with your connection string

### Step 6: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 🎯 Demo Accounts

### Student Account
- **Email**: `student@demo.com`
- **Password**: `password123`

### Admin Account
- **Email**: `admin@demo.com`
- **Password**: `password123`

*Note: You'll need to create these accounts manually or through registration*

## 📁 Project Structure

```
college-resource-hub/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & upload middleware
│   ├── utils/             # Helper functions
│   ├── config/            # Database & Cloudinary config
│   ├── .env               # Environment variables
│   └── server.js          # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── admin/     # Admin dashboard sections and forms
│   │   │   ├── common/    # Shared icons and status components
│   │   │   ├── resources/ # Resource filters, cards, and pagination
│   │   │   └── Layout/    # Navbar and footer
│   │   ├── pages/         # Page components
│   │   ├── utils/          # Shared frontend formatting helpers
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── public/            # Static files
└── README.md              # Documentation
```

## 🔧 Configuration Details

### JWT Secrets
Generate strong secrets using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Gmail Setup (for password reset)
1. Enable 2-factor authentication on Gmail
2. Generate an "App Password"
3. Use the app password in `EMAIL_PASS`

### File Upload Limits
- Maximum file size: 10MB
- Allowed types: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG

## 🚨 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**2. Cloudinary Upload Error**
```
Error: Must supply cloud_name
```
**Solution**: Check your Cloudinary credentials in `.env`

**3. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `.env` or kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**4. CORS Error**
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked
```
**Solution**: Backend CORS is configured for localhost:3000. If using different ports, update `server.js`

### Development Tips

**1. Auto-restart Backend**
```bash
npm install -g nodemon
cd backend
nodemon server.js
```

**2. View Database**
- Install MongoDB Compass for GUI
- Or use MongoDB shell: `mongo`

**3. API Testing**
- Use Postman or Thunder Client
- Base URL: `http://localhost:5000/api`

## 🌐 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Use MongoDB Atlas for database
3. Deploy with Git

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy `build` folder
3. Add redirects for SPA routing

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Look at console errors (F12 in browser)
3. Check backend logs
4. Create an issue on GitHub

## ✅ Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running
- [ ] Cloudinary account created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 3000)
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can upload files (after Cloudinary setup)

**🎉 You're all set! Happy coding!**