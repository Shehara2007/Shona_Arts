import { Bot, Heart, ShoppingBag, Star, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addToCart, toggleWishlist } from '../redux/cartSlice';
import { fetchArtwork } from '../redux/artworkSlice';

export function ArtworkDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const artworks = useAppSelector((state) => state.artworks.items);
  const selected = useAppSelector((state) => state.artworks.selected);
  const artwork = artworks.find((item) => item._id === id) ?? (selected?._id === id ? selected : undefined);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    if (id && !artwork) void dispatch(fetchArtwork(id));
  }, [artwork, dispatch, id]);

  if (!artwork) {
    return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-zinc-500">Loading artwork...</section>;
  }

  const related = artworks.filter((item) => item._id !== artwork._id).slice(0, 3);

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-gallery-blush">
          <button type="button" onClick={() => setZoomed(true)} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-3 text-gallery-red shadow-lg" aria-label="Zoom artwork">
            <ZoomIn className="h-5 w-5" />
          </button>
          <img src={artwork.image} alt={artwork.title} className="h-full min-h-[520px] w-full object-cover transition duration-500 hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">{artwork.category}</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold">{artwork.title}</h1>
          <p className="mt-3 text-lg text-zinc-500">by {artwork.artist}</p>
          <div className="mt-5 flex items-center gap-2 text-gallery-red">
            {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
            <span className="ml-2 text-sm font-semibold text-zinc-500">{artwork.reviews.length || 18} reviews</span>
          </div>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{artwork.description}</p>
          <div className="mt-8 rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">Price</span>
              <span className="text-3xl font-extrabold">${artwork.price}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => dispatch(addToCart(artwork))} className="inline-flex items-center justify-center gap-2 rounded-md bg-gallery-red px-5 py-3 font-bold text-white">
                <ShoppingBag className="h-5 w-5" /> Add to cart
              </button>
              <button type="button" onClick={() => dispatch(toggleWishlist(artwork))} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-5 py-3 font-bold text-gallery-red">
                <Heart className="h-5 w-5" /> Wishlist
              </button>
            </div>
          </div>
          <div className="mt-5 rounded-lg bg-gallery-rose p-5 text-gallery-ink dark:bg-white/10 dark:text-white">
            <div className="flex items-center gap-3 font-bold"><Bot className="h-5 w-5 text-gallery-red" /> AI virtual wall preview</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Upload a room image from the profile page and preview this piece on the wall before checkout.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-display text-4xl font-extrabold">AI recommended artworks</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => <ArtworkCard key={item._id} artwork={item} />)}
        </div>
      </section>
      {zoomed && (
        <button type="button" onClick={() => setZoomed(false)} className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-5" aria-label="Close zoom">
          <img src={artwork.image} alt={artwork.title} className="max-h-[92vh] max-w-[92vw] rounded-lg object-contain" />
        </button>
      )}
    </>
  );
}
