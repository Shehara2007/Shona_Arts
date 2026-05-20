import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  CreditCard,
  FileText,
  Gavel,
  Home,
  MessageSquareText,
  Moon,
  PackageCheck,
  Palette,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const adminLinks = [
  ['Overview', '/admin', BarChart3],
  ['Artworks', '/admin/artworks', Palette],
  ['Categories & Stock', '/admin/catalog', Boxes],
  ['Auctions', '/admin/auctions', Gavel],
  ['Users', '/admin/users', Users],
  ['Orders', '/admin/orders', PackageCheck],
  ['Payments', '/admin/payments', CreditCard],
  ['Reviews', '/admin/reviews', MessageSquareText],
  ['Custom Orders', '/admin/custom-orders', FileText],
  ['Notifications', '/admin/notifications', Bell],
];

export function AdminLayout() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-zinc-950/95 px-4 py-5 backdrop-blur-xl lg:block">
        <Link to="/admin" className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-gallery-red">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-display text-2xl font-extrabold">Shona Arts</span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">Admin Console</span>
          </span>
        </Link>
        <nav className="mt-6 space-y-1">
          {adminLinks.map(([label, href, Icon]) => (
            <NavLink
              key={String(href)}
              to={String(href)}
              end={href === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-gallery-red text-white shadow-lg shadow-red-500/20' : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {String(label)}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="mt-8 flex items-center gap-2 rounded-md border border-white/10 px-3 py-3 text-sm font-bold text-zinc-300 hover:bg-white/10">
          <ChevronLeft className="h-4 w-4" /> Back to storefront
        </Link>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">Role based frontend</p>
              <h1 className="font-display text-2xl font-extrabold">Admin Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="rounded-md border border-white/10 p-3 text-zinc-300 hover:bg-white/10 lg:hidden" aria-label="Storefront">
                <Home className="h-5 w-5" />
              </Link>
              <button type="button" onClick={toggleTheme} className="rounded-md border border-white/10 p-3 text-zinc-300 hover:bg-white/10" aria-label="Toggle theme">
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:hidden">
            {adminLinks.map(([label, href, Icon]) => (
              <NavLink
                key={String(href)}
                to={String(href)}
                end={href === '/admin'}
                className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${isActive ? 'bg-gallery-red text-white' : 'bg-white/10 text-zinc-300'}`}
              >
                <Icon className="h-4 w-4" /> {String(label)}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
