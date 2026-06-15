import { ArrowRight, Bell, CreditCard, Heart, Image, PackageSearch, Sparkles, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const shortcuts = [
  { label: 'Profile', href: '/account/profile', icon: UserRound, description: 'Update your account details and shipping info.' },
  { label: 'Orders', href: '/account/orders', icon: PackageSearch, description: 'Track purchases and delivery progress.' },
  { label: 'Payments', href: '/account/payments', icon: CreditCard, description: 'Review payment confirmations and history.' },
  { label: 'Saved', href: '/account/saved', icon: Heart, description: 'Return to artworks you bookmarked.' },
  { label: 'Wall Preview', href: '/account/wall-preview', icon: Image, description: 'Preview artworks on your own room photo.' },
  { label: 'Recommendations', href: '/account/recommendations', icon: Sparkles, description: 'See AI-picked works for your taste.' },
  { label: 'Notifications', href: '/account/notifications', icon: Bell, description: 'Check order, auction, and request updates.' },
];

export function UserDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const artworks = useAppSelector((state) => state.artworks.items.slice(0, 4));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Customer space</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold leading-tight">Welcome{user?.name ? `, ${user.name}` : ''}.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            This is your dedicated customer dashboard for browsing artworks, checking orders, saving favorites, and using AI features.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/gallery" className="inline-flex items-center gap-2 rounded-md bg-gallery-red px-5 py-3 font-bold text-white shadow-lg shadow-red-500/20">
              Browse artworks <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/account/profile" className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-5 py-3 font-bold text-gallery-red dark:border-white/10 dark:bg-zinc-900">
              Open account
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {artworks.map((artwork) => (
            <Link key={artwork._id} to={`/artworks/${artwork._id}`} className="group overflow-hidden rounded-2xl bg-white shadow-glass dark:bg-zinc-900">
              <img src={artwork.image} alt={artwork.title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gallery-red">Featured</p>
                <h2 className="mt-1 text-lg font-extrabold">{artwork.title}</h2>
                <p className="text-sm text-zinc-500">{artwork.artist}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map(({ label, href, icon: Icon, description }) => (
          <Link key={label} to={href} className="glass rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-xl">
            <Icon className="h-7 w-7 text-gallery-red" />
            <h2 className="mt-4 text-xl font-extrabold">{label}</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}