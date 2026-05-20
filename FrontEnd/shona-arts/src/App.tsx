import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminLayout } from './layouts/AdminLayout';
import { AppLayout } from './layouts/AppLayout';
import { CustomerAccountLayout } from './layouts/CustomerAccountLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Gallery = lazy(() => import('./pages/Gallery').then((module) => ({ default: module.Gallery })));
const ArtworkDetails = lazy(() => import('./pages/ArtworkDetails').then((module) => ({ default: module.ArtworkDetails })));
const Auctions = lazy(() => import('./pages/Auctions').then((module) => ({ default: module.Auctions })));
const Auth = lazy(() => import('./pages/Auth').then((module) => ({ default: module.Auth })));
const CustomOrder = lazy(() => import('./pages/CustomOrder').then((module) => ({ default: module.CustomOrder })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const About = lazy(() => import('./pages/SimplePages').then((module) => ({ default: module.About })));
const Cart = lazy(() => import('./pages/SimplePages').then((module) => ({ default: module.Cart })));
const Contact = lazy(() => import('./pages/SimplePages').then((module) => ({ default: module.Contact })));
const Orders = lazy(() => import('./pages/SimplePages').then((module) => ({ default: module.Orders })));
const Profile = lazy(() => import('./pages/SimplePages').then((module) => ({ default: module.Profile })));
const Wishlist = lazy(() => import('./pages/SimplePages').then((module) => ({ default: module.Wishlist })));

const CustomerProfile = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerProfile })));
const CustomerOrders = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerOrders })));
const CustomerPayments = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerPayments })));
const CustomerSaved = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerSaved })));
const CustomerWallPreview = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerWallPreview })));
const CustomerRecommendations = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerRecommendations })));
const CustomerNotifications = lazy(() => import('./pages/customer/CustomerPages').then((module) => ({ default: module.CustomerNotifications })));

const AdminArtworks = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminArtworks })));
const AdminCatalog = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminCatalog })));
const AdminAuctions = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminAuctions })));
const AdminUsers = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminUsers })));
const AdminOrders = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminOrders })));
const AdminPayments = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminPayments })));
const AdminReviews = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminReviews })));
const AdminCustomOrders = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminCustomOrders })));
const AdminNotifications = lazy(() => import('./pages/admin/AdminManagementPages').then((module) => ({ default: module.AdminNotifications })));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="artworks/:id" element={<ArtworkDetails />} />
          <Route path="auctions" element={<Auctions />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="custom-order" element={<CustomOrder />} />
          <Route path="login" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="account" element={<CustomerAccountLayout />}>
              <Route index element={<CustomerProfile />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="payments" element={<CustomerPayments />} />
              <Route path="saved" element={<CustomerSaved />} />
              <Route path="wall-preview" element={<CustomerWallPreview />} />
              <Route path="recommendations" element={<CustomerRecommendations />} />
              <Route path="notifications" element={<CustomerNotifications />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="artworks" element={<AdminArtworks />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="auctions" element={<AdminAuctions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="custom-orders" element={<AdminCustomOrders />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
