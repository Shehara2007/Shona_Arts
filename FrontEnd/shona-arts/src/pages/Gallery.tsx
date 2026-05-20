import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ArtworkCard } from '../components/ArtworkCard';
import { useAppSelector } from '../hooks/redux';

export function Gallery() {
  const artworks = useAppSelector((state) => state.artworks.items);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [sort, setSort] = useState('popular');

  const filtered = useMemo(() => {
    return artworks
      .filter((artwork) => category === 'All' || artwork.category === category)
      .filter((artwork) => style === 'All' || artwork.style === style)
      .filter((artwork) => artwork.title.toLowerCase().includes(query.toLowerCase()) || artwork.artist.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === 'price' ? a.price - b.price : b.popularity - a.popularity));
  }, [artworks, category, query, sort, style]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Gallery</p>
          <h1 className="font-display text-5xl font-extrabold">Browse paintings and digital art</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="relative sm:col-span-2">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artworks" className="w-full rounded-md border border-red-100 bg-white py-3 pl-10 pr-3 outline-none focus:border-gallery-red dark:border-white/10 dark:bg-zinc-900" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-red-100 bg-white px-3 py-3 dark:border-white/10 dark:bg-zinc-900">
            {['All', 'Painting', 'Digital Art', 'Commission'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-md border border-red-100 bg-white px-3 py-3 dark:border-white/10 dark:bg-zinc-900">
            <option value="popular">Popularity</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {['All', 'Abstract', 'Modern', 'Realism'].map((item) => (
          <button key={item} type="button" onClick={() => setStyle(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${style === item ? 'bg-gallery-red text-white' : 'bg-white text-gallery-ink dark:bg-zinc-900 dark:text-white'}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((artwork) => <ArtworkCard key={artwork._id} artwork={artwork} />)}
      </div>
    </section>
  );
}
