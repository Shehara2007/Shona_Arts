# 🧪 Shona Arts API Testing Guide

Complete guide for testing all API endpoints using Postman, cURL, or any HTTP client.

## 📋 Table of Contents

- [Setup](#setup)
- [Authentication](#authentication)
- [Paintings](#paintings)
- [Commerce](#commerce)
- [Auctions](#auctions)
- [AI Features](#ai-features)
- [File Uploads](#file-uploads)

## 🔧 Setup

### Base URL
```
Local: http://localhost:5000/api
Production: https://your-api-url.com/api
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

## 🔐 Authentication

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "wishlist": [],
    "orders": []
  }
}
```

## 🎨 Paintings

### 1. Get All Paintings

**Endpoint:** `GET /paintings`

**Query Parameters:**
- `category` - Filter by category (Abstract, Portrait, Landscape, etc.)
- `style` - Filter by style (Modern, Contemporary, etc.)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search by title or artist
- `sort` - Sort by (price, popularity, createdAt)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**
```
GET /paintings?category=Abstract&minPrice=500&maxPrice=2000&sort=-popularity&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "pages": 3
  },
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "title": "Sunset Dreams",
      "category": "Abstract",
      "description": "A vibrant abstract piece...",
      "price": 1200,
      "image": "https://...",
      "artist": "Maria Rodriguez",
      "style": "Abstract",
      "popularity": 85,
      "stock": 1,
      "featured": true
    }
  ]
}
```

### 2. Get Single Painting

**Endpoint:** `GET /paintings/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "title": "Sunset Dreams",
    "category": "Abstract",
    "description": "A vibrant abstract piece...",
    "price": 1200,
    "image": "https://...",
    "images": ["https://...", "https://..."],
    "artist": "Maria Rodriguez",
    "style": "Abstract",
    "popularity": 85,
    "stock": 1,
    "featured": true,
    "reviews": []
  }
}
```

### 3. Create Painting (Admin Only)

**Endpoint:** `POST /paintings`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Request Body:**
```json
{
  "title": "New Masterpiece",
  "category": "Abstract",
  "description": "An incredible new artwork",
  "price": 1500,
  "image": "https://cloudinary.com/...",
  "images": ["https://cloudinary.com/..."],
  "artist": "John Artist",
  "style": "Modern",
  "stock": 1,
  "featured": false
}
```

### 4. Update Painting (Admin Only)

**Endpoint:** `PUT /paintings/:id`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Request Body:**
```json
{
  "price": 1800,
  "stock": 2,
  "featured": true
}
```

### 5. Delete Painting (Admin Only)

**Endpoint:** `DELETE /paintings/:id`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

## 🛒 Commerce

### 1. Add to Cart

**Endpoint:** `POST /cart`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "paintingId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "quantity": 1
}
```

### 2. Get Cart

**Endpoint:** `GET /cart`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "painting": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
          "title": "Sunset Dreams",
          "price": 1200,
          "image": "https://..."
        },
        "quantity": 1
      }
    ],
    "total": 1200
  }
}
```

### 3. Add to Wishlist

**Endpoint:** `POST /wishlist`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "paintingId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

### 4. Create Order

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "items": [
    {
      "painting": "64f5a1b2c3d4e5f6g7h8i9j0",
      "quantity": 1,
      "price": 1200
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "payhere",
  "totalPrice": 1200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "orderNumber": "ORD-2024-001",
    "items": [...],
    "totalPrice": 1200,
    "paymentStatus": "pending",
    "orderStatus": "processing"
  }
}
```

## 🔨 Auctions

### 1. Get All Auctions

**Endpoint:** `GET /auctions`

**Query Parameters:**
- `status` - Filter by status (draft, live, closed)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "artworkId": {
        "_id": "...",
        "title": "Sunset Dreams",
        "image": "https://..."
      },
      "startingPrice": 840,
      "highestBid": 1050,
      "currentWinner": "...",
      "endTime": "2024-06-15T18:00:00.000Z",
      "status": "live",
      "bidHistory": [...]
    }
  ]
}
```

### 2. Place Bid

**Endpoint:** `POST /auctions/:id/bid`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "amount": 1100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bid placed successfully",
  "data": {
    "auction": {
      "_id": "...",
      "highestBid": 1100,
      "currentWinner": "YOUR_USER_ID"
    },
    "bidRating": "Strong Bid"
  }
}
```

### 3. Get Bid History

**Endpoint:** `GET /auctions/:id/history`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "...",
      "bidderName": "John Doe",
      "amount": 1100,
      "createdAt": "2024-06-10T14:30:00.000Z"
    },
    {
      "userId": "...",
      "bidderName": "Jane Smith",
      "amount": 1050,
      "createdAt": "2024-06-10T14:25:00.000Z"
    }
  ]
}
```

## 🤖 AI Features

### 1. Estimate Artwork Value

**Endpoint:** `POST /ai/estimate-value`

**Request Body (Option 1 - By Artwork ID):**
```json
{
  "artworkId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Request Body (Option 2 - Custom Details):**
```json
{
  "artworkDetails": {
    "title": "My Artwork",
    "category": "Abstract",
    "style": "Modern",
    "artist": "John Artist",
    "price": 1200,
    "popularity": 75,
    "size": "100x80cm",
    "medium": "Oil on Canvas",
    "condition": "Excellent",
    "year": 2020
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimatedMinValue": 1000,
    "estimatedMaxValue": 1600,
    "confidence": 85,
    "marketTrend": "Rising",
    "factors": [
      {
        "factor": "Category Demand",
        "impact": "Positive",
        "description": "Abstract artworks are currently in high demand"
      },
      {
        "factor": "Style Trend",
        "impact": "Positive",
        "description": "Modern style is currently trending"
      }
    ],
    "explanation": "Based on analysis of 5 key factors including Abstract category demand..."
  }
}
```

### 2. Get Bid Suggestion

**Endpoint:** `POST /ai/suggest-bid`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "auctionId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestedBid": 1150,
    "minBid": 1100,
    "maxBid": 1560,
    "bidRating": "Strong Bid",
    "confidence": 80,
    "reasoning": "With 15 bids and 45 minutes remaining, competition is medium...",
    "strategy": "Final hour: Bid decisively to secure the artwork!"
  }
}
```

### 3. Chat with AI

**Endpoint:** `POST /ai/chat`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "question": "Is this price fair?",
  "artworkId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "context": "artwork-detail"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Based on AI analysis, 'Sunset Dreams' is priced fairly. The estimated market value ranges from $1,000 to $1,600. Current price: $1,200. Market trend: Rising. This is a good opportunity.",
    "suggestions": [
      "What factors affect the value?",
      "Show me similar artworks",
      "Add to cart"
    ]
  }
}
```

### 4. Get Recommendations

**Endpoint:** `GET /ai/recommendations`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Query Parameters:**
- `limit` - Number of recommendations (default: 6)

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "...",
      "title": "Abstract Dreams",
      "category": "Abstract",
      "price": 1100,
      "image": "https://..."
    }
  ]
}
```

### 5. Get AI-Enhanced Artwork Details

**Endpoint:** `GET /ai/artwork-details/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "artwork": {
      "_id": "...",
      "title": "Sunset Dreams",
      "category": "Abstract",
      "price": 1200
    },
    "valuation": {
      "estimatedMinValue": 1000,
      "estimatedMaxValue": 1600,
      "confidence": 85,
      "marketTrend": "Rising"
    },
    "aiInsights": {
      "styleDescription": "Abstract art uses visual language of shape, form...",
      "categoryInsights": "Abstract artworks are highly sought after...",
      "artistBackground": "Maria Rodriguez is a talented artist...",
      "investmentPotential": "High - Strong upward trend with solid market confidence"
    }
  }
}
```

## 📤 File Uploads

### Upload Image

**Endpoint:** `POST /uploads/image`

**Headers:** 
- `Authorization: Bearer YOUR_TOKEN`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image` - File (JPG, PNG, WebP)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "shona-arts/paintings/abc123",
    "width": 1920,
    "height": 1080
  }
}
```

## 🧪 Testing with cURL

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Example: Get Paintings with Auth
```bash
curl -X GET "http://localhost:5000/api/paintings?category=Abstract" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example: AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "question": "Tell me about this artwork",
    "artworkId": "64f5a1b2c3d4e5f6g7h8i9j0"
  }'
```

## 📊 Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "Shona Arts API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## 🔍 Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🎯 Testing Checklist

- [ ] User registration and login
- [ ] Get all paintings with filters
- [ ] Get single painting details
- [ ] Add to cart and wishlist
- [ ] Create order
- [ ] View live auctions
- [ ] Place bid on auction
- [ ] Get AI artwork valuation
- [ ] Get AI bid suggestion
- [ ] Chat with AI assistant
- [ ] Get personalized recommendations
- [ ] Upload images
- [ ] Admin: Create/update/delete paintings
- [ ] Admin: Manage auctions

---

**Happy Testing! 🚀**
