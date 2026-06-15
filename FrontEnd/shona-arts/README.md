# Shona Arts - AI Powered Art Selling Platform

Production-ready MERN stack marketplace for paintings, digital artworks, custom art commissions, AI wall previews, live auctions, PayHere checkout, and admin management.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Redux Toolkit, React Router, Axios, Framer Motion, Socket.io Client
- Forms/UI: React Hook Form, Zod, Shadcn-style local primitives, Lucide icons, skeleton loaders, toasts, lazy routes
- Backend: Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs, Socket.io
- Services: Cloudinary image uploads, PayHere payment sessions
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database

## Project Structure

```text
src/
  components/ pages/ layouts/ routes/ redux/ hooks/ services/ context/ assets/ animations/ utils/ lib/ types/
backend/
  src/config src/controllers src/middleware src/models src/routes src/services src/sockets src/utils src/validations src/types
```

## Local Setup

```bash
npm install
npm install --prefix backend
cp .env.example .env
cp backend/.env.example backend/.env
npm run dev:all
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5001`.

## Environment Variables

Frontend `.env`:

```text
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_PAYHERE_MERCHANT_ID=your_payhere_merchant_id
```

Backend `backend/.env`:

```text
PORT=5001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/shona-arts
JWT_SECRET=replace_with_long_random_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_secret
PAYHERE_NOTIFY_URL=https://your-render-service.onrender.com/api/payments/notify
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `GET /api/paintings`
- `GET /api/paintings?page=1&limit=12&search=lotus&category=Painting&style=Modern&minPrice=50&maxPrice=500`
- `GET /api/paintings/:id`
- `GET /api/paintings/recommendations/ai`
- `POST /api/paintings` admin
- `PATCH /api/paintings/:id` admin
- `DELETE /api/paintings/:id` admin
- `POST /api/uploads`
- `POST /api/orders`
- `GET /api/orders/my`
- `POST /api/payments/session`
- `POST /api/payments/notify`
- `GET /api/auctions`
- `POST /api/auctions` admin
- `POST /api/reviews`
- `POST /api/custom-orders`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/admin/dashboard` admin

## Implemented Feature Map

- Customer: login/register, Google login endpoint, protected routes, gallery search/filter/sort, artwork zoom, related AI recommendations, cart quantity updates, wishlist, PayHere checkout session API, order history route, profile wall preview, custom devotional/spiritual art request form, live auction countdown, bid history UI, ratings model, notifications API, dark/light mode.
- Admin: protected dashboard, revenue/user growth visual analytics, management panels for artworks, users, orders, auctions, reviews, bids, payments, and custom orders.
- Backend: MVC controllers/routes/models, JWT auth, bcrypt password hashing, role authorization, Helmet, rate limiting, validation middleware, pagination, filtering, search, Cloudinary upload, PayHere hash session, Socket.io bidding, notification service, recommendation service.
- UI/UX: glassmorphism, white/deep-red/soft-black theme, Framer Motion animation, Shadcn-style components, skeleton loaders, toast notifications, lazy loaded pages, responsive mobile-first layouts.

## Role-Based Frontends

Customer storefront:

- `/` home
- `/gallery`
- `/artworks/:id`
- `/auctions`
- `/cart`
- `/wishlist`
- `/custom-order`
- `/account/profile`
- `/account/orders`
- `/account/payments`
- `/account/saved`
- `/account/wall-preview`
- `/account/recommendations`
- `/account/notifications`

Admin console:

- `/admin`
- `/admin/artworks`
- `/admin/catalog`
- `/admin/auctions`
- `/admin/users`
- `/admin/orders`
- `/admin/payments`
- `/admin/reviews`
- `/admin/custom-orders`
- `/admin/notifications`

The admin console uses a separate sidebar layout and remains protected by `ProtectedRoute role="admin"`.

## Real-Time Bidding

The frontend connects to Socket.io and joins an auction room with `joinAuction`. Bids are emitted with `placeBid` and broadcast through `bidUpdated`. Database-backed auctions update `highestBid`; the included demo auction also works without a database record.

## Deployment

1. Create a MongoDB Atlas cluster and set `MONGO_URI`.
2. Create a Cloudinary account and set the Cloudinary variables.
3. Configure PayHere merchant credentials and callback URL.
4. Deploy `backend/` to Render using:
   - Build: `npm install && npm run build`
   - Start: `npm start`
5. Deploy the Vite app to Vercel using:
   - Build: `npm run build`
   - Output: `dist`
6. Set `VITE_API_URL` and `VITE_SOCKET_URL` to the Render backend URL.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
