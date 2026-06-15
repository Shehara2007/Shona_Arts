# 🚀 Shona Arts - Deployment Checklist

Complete checklist for deploying Shona Arts to production.

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Code properly commented
- [ ] Unused imports removed
- [ ] Console.logs removed from production code
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Empty states handled

### ✅ Testing
- [ ] All API endpoints tested
- [ ] Authentication flow tested
- [ ] Payment flow tested (sandbox)
- [ ] Auction bidding tested
- [ ] AI features tested
- [ ] File uploads tested
- [ ] Admin dashboard tested
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing done

### ✅ Security
- [ ] Environment variables secured
- [ ] JWT secret is strong (32+ characters)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] Input validation implemented
- [ ] SQL injection prevention (NoSQL)
- [ ] XSS protection enabled
- [ ] HTTPS ready

### ✅ Performance
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting done
- [ ] Database indexes created
- [ ] API response times < 200ms
- [ ] Bundle size optimized
- [ ] Caching strategies implemented

### ✅ Documentation
- [ ] README.md complete
- [ ] API documentation ready
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide included

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Create Cluster**
   ```
   - Go to MongoDB Atlas
   - Create a new cluster (M0 free tier)
   - Choose region closest to your users
   - Wait for cluster creation
   ```

2. **Database Access**
   ```
   - Create database user
   - Username: shonaarts_admin
   - Password: [Generate strong password]
   - Role: Read and write to any database
   ```

3. **Network Access**
   ```
   - Add IP Address
   - Allow access from anywhere: 0.0.0.0/0
   - Or add specific IPs for better security
   ```

4. **Get Connection String**
   ```
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your password
   ```

5. **Create Database**
   ```
   - Database name: shona-arts
   - Collections will be created automatically
   ```

### Database Indexes (Optional but Recommended)

Run these in MongoDB Compass or Atlas:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })

// Paintings collection
db.paintings.createIndex({ category: 1, style: 1 })
db.paintings.createIndex({ price: 1 })
db.paintings.createIndex({ popularity: -1 })
db.paintings.createIndex({ featured: 1 })

// Auctions collection
db.auctions.createIndex({ status: 1, endTime: 1 })
db.auctions.createIndex({ artworkId: 1 })

// Orders collection
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ orderStatus: 1 })

// AIChat collection
db.aichats.createIndex({ userId: 1, createdAt: -1 })
db.aichats.createIndex({ artworkId: 1 })
```

## ☁️ Cloudinary Setup

1. **Create Account**
   ```
   - Go to cloudinary.com
   - Sign up for free account
   - Verify email
   ```

2. **Get Credentials**
   ```
   - Go to Dashboard
   - Copy Cloud Name
   - Copy API Key
   - Copy API Secret
   ```

3. **Create Upload Preset (Optional)**
   ```
   - Go to Settings > Upload
   - Create upload preset
   - Name: shona-arts-paintings
   - Signing Mode: Signed
   - Folder: shona-arts/paintings
   ```

4. **Configure Transformations**
   ```
   - Set default quality: auto
   - Enable format: auto
   - Set max dimensions: 2000x2000
   ```

## 🚀 Backend Deployment (Render)

### 1. Prepare Backend

```bash
cd backend

# Test build locally
npm run build

# Test production start
npm start
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repository

### 3. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   ```
   Name: shona-arts-api
   Region: [Choose closest to users]
   Branch: main
   Root Directory: FrontEnd/shona-arts/backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

### 4. Add Environment Variables

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shona-arts

JWT_SECRET=your-super-secret-jwt-key-min-32-characters-production
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_SANDBOX=false
```

### 5. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://shona-arts-api.onrender.com`

### 6. Test Backend

```bash
# Health check
curl https://shona-arts-api.onrender.com/health

# Should return: {"status":"ok","service":"shona-arts-api"}
```

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend

```bash
cd FrontEnd/shona-arts

# Update .env with production API URL
VITE_API_URL=https://shona-arts-api.onrender.com/api
VITE_SOCKET_URL=https://shona-arts-api.onrender.com

# Test build locally
npm run build

# Test preview
npm run preview
```

### 2. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### 3. Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: FrontEnd/shona-arts
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### 4. Add Environment Variables

```env
VITE_API_URL=https://shona-arts-api.onrender.com/api
VITE_SOCKET_URL=https://shona-arts-api.onrender.com
VITE_APP_NAME=Shona Arts
VITE_APP_VERSION=1.0.0
```

### 5. Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://shona-arts.vercel.app`

### 6. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## 🔄 Update Backend with Frontend URL

After frontend deployment:

1. Go to Render dashboard
2. Select your backend service
3. Update environment variable:
   ```
   CLIENT_URL=https://shona-arts.vercel.app
   ```
4. Save and redeploy

## 🧪 Post-Deployment Testing

### Backend Tests

```bash
# Health check
curl https://shona-arts-api.onrender.com/health

# Register user
curl -X POST https://shona-arts-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123"}'

# Get paintings
curl https://shona-arts-api.onrender.com/api/paintings
```

### Frontend Tests

- [ ] Homepage loads correctly
- [ ] Gallery displays artworks
- [ ] Search and filters work
- [ ] User can register
- [ ] User can login
- [ ] Add to cart works
- [ ] Auctions display correctly
- [ ] AI chatbot responds
- [ ] Images load from Cloudinary
- [ ] Mobile view works
- [ ] All pages accessible

### Integration Tests

- [ ] Frontend connects to backend
- [ ] Authentication flow works
- [ ] API calls succeed
- [ ] Real-time bidding works
- [ ] File uploads work
- [ ] Payment flow works (sandbox)
- [ ] Admin dashboard accessible

## 📊 Monitoring Setup

### Render Monitoring

1. Go to your service dashboard
2. Check "Metrics" tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Vercel Analytics

1. Go to Project → Analytics
2. Enable Web Analytics
3. Monitor:
   - Page views
   - Unique visitors
   - Performance scores

### Database Monitoring

1. Go to MongoDB Atlas
2. Check "Metrics" tab
3. Monitor:
   - Connections
   - Operations
   - Storage size

## 🔐 Security Hardening

### Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ chars)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Add security headers (Helmet)
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use environment variables
- [ ] Enable MongoDB IP whitelist
- [ ] Regular security updates

### Recommended Security Headers

```javascript
// Already configured in backend
helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
})
```

## 🎯 Performance Optimization

### Backend Optimization

- [ ] Enable compression
- [ ] Implement caching (Redis)
- [ ] Optimize database queries
- [ ] Use connection pooling
- [ ] Enable CDN for static assets
- [ ] Implement pagination
- [ ] Use indexes on database

### Frontend Optimization

- [ ] Code splitting
- [ ] Lazy loading images
- [ ] Optimize bundle size
- [ ] Enable service worker
- [ ] Compress images
- [ ] Use CDN for assets
- [ ] Implement caching

## 📱 SEO Optimization

### Meta Tags

Add to `index.html`:

```html
<meta name="description" content="Shona Arts - AI-powered online art marketplace">
<meta name="keywords" content="art, paintings, online gallery, auctions">
<meta property="og:title" content="Shona Arts">
<meta property="og:description" content="Discover and purchase unique artworks">
<meta property="og:image" content="https://your-domain.com/og-image.jpg">
<meta property="og:url" content="https://your-domain.com">
<meta name="twitter:card" content="summary_large_image">
```

### Sitemap

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/gallery</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/auctions</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Both Vercel and Render support auto-deployment:

1. **Vercel**: Automatically deploys on push to main branch
2. **Render**: Configure auto-deploy in settings

### Deployment Workflow

```
1. Develop locally
2. Test thoroughly
3. Commit to feature branch
4. Create pull request
5. Review code
6. Merge to main
7. Auto-deploy to production
8. Monitor deployment
9. Test production
10. Rollback if needed
```

## 📧 Email Notifications (Optional)

### Setup SendGrid or Gmail

1. Create account
2. Get API key or app password
3. Add to environment variables:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

## 💳 Payment Gateway Setup

### PayHere Production

1. Go to [PayHere](https://www.payhere.lk/)
2. Create merchant account
3. Complete verification
4. Get production credentials
5. Update environment variables:
   ```
   PAYHERE_MERCHANT_ID=your-production-merchant-id
   PAYHERE_MERCHANT_SECRET=your-production-secret
   PAYHERE_SANDBOX=false
   ```

## 📊 Analytics Setup (Optional)

### Google Analytics

1. Create GA4 property
2. Get Measurement ID
3. Add to frontend `.env`:
   ```
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

### Facebook Pixel

1. Create Facebook Pixel
2. Get Pixel ID
3. Add to frontend `.env`:
   ```
   VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX
   ```

## 🐛 Troubleshooting

### Common Issues

**Issue**: Backend not connecting to database  
**Solution**: Check MongoDB connection string and IP whitelist

**Issue**: CORS errors  
**Solution**: Verify CLIENT_URL matches frontend URL exactly

**Issue**: Images not uploading  
**Solution**: Check Cloudinary credentials and upload limits

**Issue**: Real-time bidding not working  
**Solution**: Ensure Socket.io URL is correct and CORS configured

**Issue**: Build fails on Vercel  
**Solution**: Check build logs, ensure all dependencies installed

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] Real-time features working
- [ ] File uploads working
- [ ] AI features working
- [ ] Admin dashboard accessible
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team notified

## 🎉 Launch!

Once all checks pass:

1. Announce launch
2. Monitor closely for 24 hours
3. Gather user feedback
4. Fix any issues quickly
5. Plan next iteration

## 📞 Support

If you encounter issues:

1. Check logs in Render/Vercel dashboard
2. Review MongoDB Atlas logs
3. Test API endpoints individually
4. Check browser console for errors
5. Review deployment checklist

---

**Congratulations on deploying Shona Arts! 🎨✨**

Your AI-powered art marketplace is now live!
