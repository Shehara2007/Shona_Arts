import { ArrowRight, Bot, Gavel, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArtworkCard } from '../components/ArtworkCard';
import { useAppSelector } from '../hooks/redux';

export function Home() {
  const artworks = useAppSelector((state) => state.artworks.items.slice(0, 3));
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(217,31,60,0.16),transparent_32%),linear-gradient(135deg,#fffaf8,#fff0f3)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(217,31,60,0.16),transparent_32%),linear-gradient(135deg,#18181b,#24191b)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gallery-red shadow-sm dark:bg-white/10">
              <Sparkles className="h-4 w-4" /> AI Powered Art Marketplace
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-tight text-gallery-ink dark:text-white sm:text-6xl lg:text-7xl">
              Shona Arts
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Buy original paintings, discover digital artworks, request custom commissions, join live auctions, and preview pieces on your own wall.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/gallery" className="inline-flex items-center gap-2 rounded-md bg-gallery-red px-5 py-3 font-bold text-white shadow-lg shadow-red-500/20">
                Explore gallery <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/auctions" className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-5 py-3 font-bold text-gallery-red dark:border-white/10 dark:bg-zinc-900">
                Live auctions
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {artworks.slice(0, 2).map((artwork, index) => (
              <img key={artwork._id} src={artwork.image} alt={artwork.title} className={`h-80 w-full rounded-lg object-cover shadow-glass ${index === 1 ? 'mt-12' : ''}`} />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [Bot, 'AI wall preview', 'Upload a room photo and test scale, placement, and mood before buying.'],
            [Gavel, 'Real-time bidding', 'Socket.io powered auction rooms keep every highest bid live.'],
            [ShieldCheck, 'Secure checkout', 'JWT protected checkout with PayHere payment session support.'],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="glass rounded-lg p-6">
              <Icon className="mb-4 h-7 w-7 text-gallery-red" />
              <h2 className="text-xl font-extrabold">{String(title)}</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">{String(text)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Curated now</p>
            <h2 className="font-display text-4xl font-extrabold">Collector picks</h2>
          </div>
          <Link to="/gallery" className="font-bold text-gallery-red">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {artworks.map((artwork) => <ArtworkCard key={artwork._id} artwork={artwork} />)}
        </div>
      </section>
    </>
  );
}
