# 🎨 Shona Arts — AI Powered Art Selling Platform

A modern full-stack MERN web application for online art selling, featuring AI-powered artwork valuation, live auctions, custom artwork ordering, and intelligent chatbot assistance.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [AI Features](#ai-features)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Customer Features
- 🔐 **User Authentication** - Secure registration and login with JWT
- 🖼️ **Artwork Gallery** - Browse, search, and filter artworks by category, price, style
- 🛒 **Shopping Cart & Wishlist** - Add artworks to cart and save favorites
- 💳 **Secure Payments** - PayHere integration for online payments
- 🔨 **Live Auctions** - Real-time bidding with Socket.io
- 🤖 **AI Bid Suggestions** - Smart bid recommendations based on auction dynamics
- 🎨 **Custom Artwork Orders** - Commission personalized artworks
- 🏠 **AI Wall Preview** - Visualize artworks in your room (coming soon)
- 💬 **AI Chatbot** - Get instant help about artworks, pricing, and bidding
- 💎 **AI Value Estimation** - Get AI-powered artwork valuations
- ⭐ **Reviews & Ratings** - Rate and review purchased artworks
- 📦 **Order History** - Track your orders and payments

### Admin Features
- 📊 **Admin Dashboard** - Comprehensive analytics and insights
- 🎨 **Artwork Management** - Add, edit, delete artworks
- 👥 **User Management** - Manage customer accounts
- 📦 **Order Management** - Process and track orders
- 🔨 **Auction Management** - Create and monitor live auctions
- ⭐ **Review Management** - Moderate customer reviews
- 💰 **Payment Tracking** - Monitor sales and revenue
- 📈 **Analytics** - View sales trends and performance metrics

### AI-Powered Features
1. **Artwork Value Estimator** - Analyzes category, style, artist, popularity, and market trends
2. **Bid Suggestion Engine** - Recommends optimal bid amounts with confidence ratings
3. **Intelligent Chatbot** - Answers questions about artworks, pricing, bidding, and more
4. **Personalized Recommendations** - Suggests artworks based on user preferences
5. **Market Trend Analysis** - Identifies rising, stable, or declining artwork values

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite** - Fast, modern development
- **TypeScript** - Type-safe code
- **TailwindCSS** - Utility-first styling
- **Redux Toolkit** - State management
- **React Router DOM v7** - Client-side routing
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** with **Express.js** - RESTful API
- **TypeScript** - Type-safe backend
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time bidding
- **Cloudinary** - Image storage
- **Multer** - File uploads
- **Helmet** - Security headers
- **Morgan** - Request logging

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution
- **Concurrently** - Run multiple commands

## 📁 Project Structure

```
Shona_Arts/
├── FrontEnd/
│   └── shona-arts/
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── pages/           # Page components
│       │   ├── store/           # Redux store and slices
│       │   ├── services/        # API services
│       │   ├── hooks/           # Custom React hooks
│       │   ├── types/           # TypeScript types
│       │   ├── utils/           # Utility functions
│       │   ├── App.tsx          # Main app component
│       │   └── main.tsx         # Entry point
│       ├── public/              # Static assets
│       ├── package.json
│       └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── db.ts            # MongoDB connection
│   │   │   └── cloudinary.ts    # Cloudinary config
│   │   ├── models/              # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Painting.ts
│   │   │   ├── Order.ts
│   │   │   ├── Auction.ts
│   │   │   ├── Bid.ts
│   │   │   ├── Review.ts
│   │   │   ├── CustomOrder.ts
│   │   │   ├── Notification.ts
│   │   │   └── AIChat.ts
│   │   ├── controllers/         # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── paintingController.ts
│   │   │   ├── commerceController.ts
│   │   │   ├── uploadController.ts
│   │   │   └── aiController.ts
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── paintingRoutes.ts
│   │   │   ├── commerceRoutes.ts
│   │   │   ├── uploadRoutes.ts
│   │   │   └── aiRoutes.ts
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.ts
│   │   │   ├── error.ts
│   │   │   └── validate.ts
│   │   ├── services/            # Business logic
│   │   │   ├── aiService.ts
│   │   │   ├── notificationService.ts
│   │   │   └── recommendationService.ts
│   │   ├── sockets/             # Socket.io handlers
│   │   │   └── auctionSocket.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── asyncHandler.ts
│   │   │   └── token.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── api.ts
│   │   └── server.ts            # Server entry point
│   ├── dist/                    # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .env.example
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shona-arts.git
cd shona-arts
```

### 2. Install Frontend Dependencies

```bash
cd FrontEnd/shona-arts
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shona-arts?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayHere Configuration (Optional)
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
```

### Frontend Environment Variables

Create a `.env` file in the `FrontEnd/shona-arts` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Getting Your Credentials

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

#### Cloudinary
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, and API Secret

#### PayHere (Optional)
1. Go to [PayHere](https://www.payhere.lk/)
2. Create a merchant account
3. Get your Merchant ID and Secret from the dashboard

## 🏃 Running the Application

### Option 1: Run Frontend and Backend Separately

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd FrontEnd/shona-arts
npm run dev
```

### Option 2: Run Both Concurrently

From the frontend directory:
```bash
cd FrontEnd/shona-arts
npm run dev:all
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
PUT    /api/auth/profile         - Update profile
POST   /api/auth/logout          - Logout user
```

### Painting Endpoints

```
GET    /api/paintings            - Get all paintings (with filters)
GET    /api/paintings/:id        - Get single painting
POST   /api/paintings            - Create painting (Admin)
PUT    /api/paintings/:id        - Update painting (Admin)
DELETE /api/paintings/:id        - Delete painting (Admin)
GET    /api/paintings/featured   - Get featured paintings
```

### Commerce Endpoints

```
POST   /api/cart                 - Add to cart
GET    /api/cart                 - Get cart items
PUT    /api/cart/:id             - Update cart item
DELETE /api/cart/:id             - Remove from cart
POST   /api/orders               - Create order
GET    /api/orders               - Get user orders
GET    /api/orders/:id           - Get single order
POST   /api/wishlist             - Add to wishlist
GET    /api/wishlist             - Get wishlist
DELETE /api/wishlist/:id         - Remove from wishlist
```

### Auction Endpoints

```
GET    /api/auctions             - Get all auctions
GET    /api/auctions/:id         - Get single auction
POST   /api/auctions             - Create auction (Admin)
POST   /api/auctions/:id/bid     - Place bid
GET    /api/auctions/:id/history - Get bid history
```

### AI Endpoints

```
POST   /api/ai/estimate-value    - Estimate artwork value
POST   /api/ai/suggest-bid       - Get bid suggestion
POST   /api/ai/chat              - Chat with AI assistant
GET    /api/ai/recommendations   - Get personalized recommendations
GET    /api/ai/artwork-details/:id - Get AI-enhanced artwork details
POST   /api/ai/batch-valuate     - Batch valuate artworks (Admin)
```

### Upload Endpoints

```
POST   /api/uploads/image        - Upload image to Cloudinary
POST   /api/uploads/multiple     - Upload multiple images
```

## 🤖 AI Features

### 1. Artwork Value Estimator

Analyzes multiple factors to estimate artwork value:
- Category demand
- Artist reputation
- Popularity score
- Style trends
- Size and medium
- Condition
- Age/historical significance

**Example Request:**
```javascript
POST /api/ai/estimate-value
{
  "artworkId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "estimatedMinValue": 1200,
    "estimatedMaxValue": 1800,
    "confidence": 85,
    "marketTrend": "Rising",
    "factors": [
      {
        "factor": "Category Demand",
        "impact": "Positive",
        "description": "Abstract artworks are currently in high demand"
      }
    ],
    "explanation": "Based on analysis of 5 key factors..."
  }
}
```

### 2. Bid Suggestion Engine

Provides intelligent bid recommendations:
- Analyzes current bid
- Considers time remaining
- Evaluates competition level
- Assesses artwork value
- Rates bid strength

**Example Request:**
```javascript
POST /api/ai/suggest-bid
{
  "auctionId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "suggestedBid": 1500,
    "minBid": 1400,
    "maxBid": 2000,
    "bidRating": "Strong Bid",
    "confidence": 80,
    "reasoning": "With 15 bids and 45 minutes remaining...",
    "strategy": "Final hour: Bid decisively to secure the artwork!"
  }
}
```

### 3. AI Chatbot

Intelligent assistant that helps with:
- Artwork history and details
- Price fairness evaluation
- Bidding strategies
- Room matching advice
- Style and technique explanations
- Custom order guidance
- Shipping and payment info

**Example Request:**
```javascript
POST /api/ai/chat
{
  "question": "Is this price fair?",
  "artworkId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "context": "artwork-detail"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "answer": "Based on AI analysis, this artwork is priced fairly...",
    "suggestions": [
      "What factors affect the value?",
      "Show me similar artworks",
      "Add to cart"
    ]
  }
}
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: 'customer' | 'admin',
  wishlist: [ObjectId],
  orders: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Painting Collection
```javascript
{
  title: String,
  category: String,
  description: String,
  price: Number,
  image: String,
  images: [String],
  stock: Number,
  artist: String,
  style: String,
  popularity: Number,
  featured: Boolean,
  reviews: [ObjectId],
  bids: [BidSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### Auction Collection
```javascript
{
  artworkId: ObjectId,
  startingPrice: Number,
  highestBid: Number,
  currentWinner: ObjectId,
  endTime: Date,
  bidHistory: [BidHistorySchema],
  winner: ObjectId,
  status: 'draft' | 'live' | 'closed',
  createdAt: Date,
  updatedAt: Date
}
```

### AIChat Collection
```javascript
{
  userId: ObjectId,
  artworkId: ObjectId (optional),
  question: String,
  answer: String,
  context: String,
  createdAt: Date
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Deploy!

### Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Create a new Web Service
4. Connect your repository
5. Set build settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
6. Add environment variables
7. Deploy!

### Environment Variables for Production

Update your `.env` files with production URLs:

**Backend:**
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Frontend:**
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## 🎨 Color Theme

The platform uses a warm, artistic color palette:

- **Primary**: Coral/Terracotta (#B85A30, #D85A30, #993C1D)
- **Accent**: Deep Purple (#534AB7, #3C3489)
- **Background**: Warm Off-White (#FAF9F7)
- **Cards**: Pure White (#FFFFFF)
- **Text**: Dark Gray (#1A1A1A), Medium Gray (#6B6B6B)

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd FrontEnd/shona-arts
npm test
```

## 📝 Default Admin Account

For testing purposes, you can create an admin account:

**Email**: admin@shonaarts.com  
**Password**: Admin@123

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Project Lead**: Your Name
- **Frontend Developer**: Your Name
- **Backend Developer**: Your Name
- **AI Engineer**: Your Name

## 📞 Support

For support, email support@shonaarts.com or join our Slack channel.

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image storage
- PayHere for payment processing
- All open-source contributors

---

**Built with ❤️ using MERN Stack + TypeScript**

🎨 **Shona Arts** - Where Art Meets Technology
