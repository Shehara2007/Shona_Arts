import { Bell, CreditCard, Heart, Image, PackageSearch, Sparkles, UserRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const accountLinks = [
  ['Profile', '/account/profile', UserRound],
  ['Orders', '/account/orders', PackageSearch],
  ['Payments', '/account/payments', CreditCard],
  ['Saved Artworks', '/account/saved', Heart],
  ['AI Wall Preview', '/account/wall-preview', Image],
  ['Recommendations', '/account/recommendations', Sparkles],
  ['Notifications', '/account/notifications', Bell],
];

export function CustomerAccountLayout() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-red-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gallery-red">Customer frontend</p>
        <nav className="mt-2 grid gap-1">
          {accountLinks.map(([label, href, Icon]) => (
            <NavLink
              key={String(href)}
              to={String(href)}
              className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold ${isActive ? 'bg-gallery-red text-white' : 'text-zinc-600 hover:bg-gallery-rose dark:text-zinc-300 dark:hover:bg-white/10'}`}
            >
              <Icon className="h-5 w-5" /> {String(label)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </section>
  );
}
