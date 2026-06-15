# 🚀 Shona Arts - Quick Start Guide

Get your Shona Arts platform up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

## 📦 Installation Steps

### 1. Clone & Install

```bash
# Navigate to project
cd "c:\Users\Shehara\Documents\3rd Sem Project\RAD\Shona_Arts"

# Install backend dependencies
cd FrontEnd/shona-arts/backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### 2. Setup Environment Variables

#### Backend (.env)

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shona-arts

# Generate a random secret (min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Get from Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)

Create `FrontEnd/shona-arts/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- ✅ Admin account: `admin@shonaarts.com` / `Admin@123`
- ✅ Customer account: `john@example.com` / `Customer@123`
- ✅ 10 sample artworks
- ✅ 3 live auctions

### 4. Run the Application

#### Option A: Run Both Together (Recommended)

```bash
cd FrontEnd/shona-arts
npm run dev:all
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd/shona-arts
npm run dev
```

### 5. Access the Application

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:5000
- 💚 **Health Check**: http://localhost:5000/health

## 🎯 First Steps

### 1. Login as Admin

1. Go to http://localhost:5173
2. Click "Login"
3. Use credentials:
   - Email: `admin@shonaarts.com`
   - Password: `Admin@123`

### 2. Explore Features

- 🎨 **Gallery**: Browse artworks with filters
- 🔨 **Auctions**: View live auctions and place bids
- 🤖 **AI Chat**: Click the chat icon (bottom-right) to ask questions
- 💎 **AI Valuation**: View artwork details to see AI value estimates
- 🛒 **Shopping**: Add items to cart and wishlist

### 3. Test AI Features

#### AI Chatbot
1. Click the floating chat button (bottom-right)
2. Try these questions:
   - "Tell me about this artwork"
   - "Is this price fair?"
   - "How much should I bid?"
   - "Will this match my room?"

#### AI Value Estimation
1. Go to any artwork detail page
2. Scroll to "AI Valuation" section
3. See estimated value range and market trends

#### AI Bid Suggestions
1. Go to Auctions page
2. Click "Place Bid" on any auction
3. See AI-suggested bid amount with rating

## 🔧 Troubleshooting

### Backend won't start

**Error**: `MongooseError: The uri parameter to openUri() must be a string`

**Solution**: Check your `MONGODB_URI` in backend/.env

```bash
# Make sure it looks like this:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shona-arts
```

### Frontend can't connect to backend

**Error**: `Network Error` or `CORS Error`

**Solution**: 
1. Make sure backend is running on port 5000
2. Check `VITE_API_URL` in frontend/.env
3. Verify `CLIENT_URL` in backend/.env matches frontend URL

### Cloudinary upload fails

**Error**: `Invalid credentials`

**Solution**: Double-check your Cloudinary credentials in backend/.env

```bash
# Get these from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Port already in use

**Error**: `Port 5000 is already in use`

**Solution**: 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

## 📚 Next Steps

1. **Read the full README**: `README.md`
2. **Test the API**: `API_TESTING_GUIDE.md`
3. **Customize**: Modify colors, add features
4. **Deploy**: Follow deployment guide in README

## 🎨 Project Structure

```
Shona_Arts/
├── FrontEnd/shona-arts/
│   ├── src/              # React frontend
│   ├── backend/          # Express backend
│   └── package.json
├── README.md             # Full documentation
├── QUICK_START.md        # This file
└── API_TESTING_GUIDE.md  # API testing guide
```

## 🔑 Default Accounts

After running `npm run seed`:

### Admin Account
- **Email**: admin@shonaarts.com
- **Password**: Admin@123
- **Access**: Full admin dashboard

### Customer Account
- **Email**: john@example.com
- **Password**: Customer@123
- **Access**: Customer features

## 🤖 AI Features Overview

### 1. Artwork Value Estimator
- Analyzes 8+ factors
- Provides min/max value range
- Shows market trend (Rising/Stable/Declining)
- Confidence score

### 2. Bid Suggestion Engine
- Real-time bid analysis
- Competition level assessment
- Bid rating (Low/Fair/Strong/Winning Chance High)
- Strategic recommendations

### 3. Intelligent Chatbot
- Artwork history and details
- Price fairness evaluation
- Bidding strategies
- Room matching advice
- Style explanations
- Custom order help

### 4. Personalized Recommendations
- Based on browsing history
- Category preferences
- Style preferences
- AI-powered matching

## 📊 Sample Data

After seeding, you'll have:

- **10 Artworks** across categories:
  - Abstract (3)
  - Landscape (3)
  - Portrait (1)
  - Digital (1)
  - Still Life (1)
  - Modern (1)

- **3 Live Auctions**:
  - Ending in 1, 2, and 3 days
  - Starting at 70% of artwork price
  - Ready for bidding

- **3 User Accounts**:
  - 1 Admin
  - 2 Customers

## 🎯 Testing Checklist

- [ ] Login as admin
- [ ] Browse gallery with filters
- [ ] View artwork details
- [ ] Add to cart
- [ ] Add to wishlist
- [ ] View live auctions
- [ ] Place a bid
- [ ] Ask AI chatbot a question
- [ ] Check AI value estimation
- [ ] Get AI bid suggestion
- [ ] Create custom order
- [ ] View admin dashboard

## 💡 Tips

1. **Use the AI Chat**: It's context-aware and very helpful!
2. **Check AI Valuations**: Every artwork has an AI-estimated value
3. **Bid Smart**: Use AI bid suggestions for better chances
4. **Explore Admin Panel**: See analytics and manage everything
5. **Test Real-time**: Open multiple browsers to see live bidding

## 🆘 Need Help?

- 📖 **Full Docs**: See `README.md`
- 🧪 **API Testing**: See `API_TESTING_GUIDE.md`
- 🐛 **Issues**: Check troubleshooting section above
- 💬 **Questions**: Contact the development team

## 🚀 Ready to Deploy?

See the deployment section in `README.md` for:
- Vercel deployment (Frontend)
- Render deployment (Backend)
- Environment variable setup
- Production configuration

---

**Happy Coding! 🎨✨**

Built with ❤️ using MERN Stack + TypeScript + AI
