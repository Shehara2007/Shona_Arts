import { Mail, MapPin, Phone, Upload } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateQuantity } from '../redux/cartSlice';

export function About() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">About</p>
      <h1 className="font-display text-5xl font-extrabold">A marketplace where artists, collectors, and AI meet.</h1>
      <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
        Shona Arts helps emerging artists sell original work, digital editions, auction pieces, and custom commissions with modern commerce tools and a thoughtful gallery experience.
      </p>
    </section>
  );
}

export function Contact() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Contact</p>
      <h1 className="font-display text-5xl font-extrabold">Commission desk and collector support</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[[Mail, 'hello@shonaarts.com'], [Phone, '+94 77 000 0000'], [MapPin, 'Colombo, Sri Lanka']].map(([Icon, text]) => (
          <div key={String(text)} className="rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
            <Icon className="mb-4 h-6 w-6 text-gallery-red" />
            <p className="font-bold">{String(text)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Profile() {
  const [room, setRoom] = useState<string>();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-extrabold">Profile and AI preview</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <label className="rounded-lg border border-dashed border-gallery-red bg-white p-8 text-center dark:bg-zinc-900">
          <Upload className="mx-auto mb-3 h-8 w-8 text-gallery-red" />
          <span className="font-bold">Upload room image</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setRoom(URL.createObjectURL(file));
          }} />
        </label>
        <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {room ? <img src={room} alt="Uploaded room" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-zinc-500">Room preview appears here</div>}
          {room && <div className="absolute left-1/2 top-1/3 h-32 w-44 -translate-x-1/2 rounded border-8 border-white bg-gallery-red/80 shadow-2xl" />}
        </div>
      </div>
    </section>
  );
}

export function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-extrabold">Cart</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.artwork._id} className="flex items-center justify-between rounded-lg bg-white p-4 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
              <img src={item.artwork.image} alt={item.artwork.title} className="h-16 w-16 rounded-md object-cover" />
              <div>
                <p className="font-bold">{item.artwork.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={() => dispatch(updateQuantity({ id: item.artwork._id, quantity: item.quantity - 1 }))} className="h-8 w-8 rounded bg-gallery-rose font-bold text-gallery-red">-</button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button type="button" onClick={() => dispatch(updateQuantity({ id: item.artwork._id, quantity: item.quantity + 1 }))} className="h-8 w-8 rounded bg-gallery-rose font-bold text-gallery-red">+</button>
                </div>
              </div>
            </div>
            <p className="font-extrabold">${item.artwork.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg bg-gallery-rose p-6 dark:bg-white/10">
        <div className="flex items-center justify-between text-2xl font-extrabold"><span>Total</span><span>${total}</span></div>
        <button type="button" className="mt-5 w-full rounded-md bg-gallery-red px-5 py-3 font-bold text-white">Checkout with PayHere</button>
      </div>
    </section>
  );
}

export function Wishlist() {
  const wishlist = useAppSelector((state) => state.cart.wishlist);
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-extrabold">Wishlist</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{wishlist.map((item) => <img key={item._id} src={item.image} alt={item.title} className="h-80 w-full rounded-lg object-cover" />)}</div></section>;
}

export function Orders() {
  return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-extrabold">Order history</h1><p className="mt-4 text-zinc-500">Paid PayHere orders and commission statuses will appear here.</p></section>;
}
