import { Bell, Heart, LayoutDashboard, Menu, Moon, ShoppingBag, Sun, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../hooks/redux';

const links = [
  ['Home', '/'],
  ['Gallery', '/gallery'],
  ['Auctions', '/auctions'],
  ['Custom Order', '/custom-order'],
  ['Orders', '/orders'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useAppSelector((state) => state.cart.wishlist.length);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gallery-paper text-gallery-ink transition dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-red-100/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-2xl font-extrabold text-gallery-red">Shona Arts</Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map(([label, href]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-gallery-red' : 'text-zinc-600 dark:text-zinc-300'}`}>
                {label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-gallery-red">
                <LayoutDashboard className="h-4 w-4" /> Admin
              </NavLink>
            )}
            {user?.role === 'customer' && (
              <NavLink to="/user" className="inline-flex items-center gap-2 text-sm font-semibold text-gallery-red">
                <LayoutDashboard className="h-4 w-4" /> User
              </NavLink>
            )}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={toggleTheme} className="rounded-full border border-red-100 p-2 dark:border-white/10" aria-label="Toggle theme">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/wishlist" className="relative rounded-full border border-red-100 p-2 dark:border-white/10" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-gallery-red px-1.5 text-xs text-white">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="relative rounded-full border border-red-100 p-2 dark:border-white/10" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-gallery-red px-1.5 text-xs text-white">{cartCount}</span>}
            </Link>
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/user') : '/login'} className="rounded-full bg-gallery-red p-2 text-white" aria-label="Profile">
              <UserRound className="h-5 w-5" />
            </Link>
            {user && (
              <Link to="/account/notifications" className="rounded-full border border-red-100 p-2 dark:border-white/10" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Link>
            )}
          </div>
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-md border border-red-100 p-2 lg:hidden" aria-label="Open menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="grid gap-2 border-t border-red-100 bg-white px-4 py-4 dark:border-white/10 dark:bg-zinc-950 lg:hidden">
            {links.map(([label, href]) => <NavLink key={href} to={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 font-semibold">{label}</NavLink>)}
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/user') : '/login'} className="rounded-md bg-gallery-red px-3 py-2 font-semibold text-white">Account</Link>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-red-100 bg-white py-10 dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-zinc-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Shona Arts - AI powered art selling platform for paintings, digital art, and commissions.</p>
          <p>Vercel frontend, Render backend, MongoDB Atlas database.</p>
        </div>
      </footer>
    </div>
  );
}
