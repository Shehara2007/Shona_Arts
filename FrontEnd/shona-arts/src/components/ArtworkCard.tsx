import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Artwork } from '../utils/types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addToCart, toggleWishlist } from '../redux/cartSlice';

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const dispatch = useAppDispatch();
  const wished = useAppSelector((state) => state.cart.wishlist.some((item) => item._id === artwork._id));

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-lg border border-red-100 bg-white shadow-sm transition dark:border-white/10 dark:bg-zinc-900"
    >
      <Link to={`/artworks/${artwork._id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-gallery-blush">
          <img src={artwork.image} alt={artwork.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gallery-red">{artwork.category}</p>
            <h3 className="mt-1 text-lg font-bold text-gallery-ink dark:text-white">{artwork.title}</h3>
            <p className="text-sm text-zinc-500">by {artwork.artist}</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(toggleWishlist(artwork))}
            className="rounded-full border border-red-100 p-2 text-gallery-red transition hover:bg-gallery-rose"
            aria-label="Toggle wishlist"
          >
            <Heart className={wished ? 'h-5 w-5 fill-current' : 'h-5 w-5'} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-gallery-ink dark:text-white">${artwork.price}</span>
          <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
            <Star className="h-4 w-4 fill-gallery-red text-gallery-red" /> {Math.round(artwork.popularity / 20)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(addToCart(artwork))}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gallery-red px-4 py-3 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
        >
          <ShoppingBag className="h-5 w-5" /> Add to cart
        </button>
      </div>
    </motion.article>
  );
}
