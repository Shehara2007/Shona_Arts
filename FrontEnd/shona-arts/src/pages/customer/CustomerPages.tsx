import { Bell, Camera, CheckCircle2, CreditCard, ImageUp, PackageSearch, Star, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { ArtworkCard } from '../../components/ArtworkCard';
import { Button } from '../../components/ui/button';
import { Card, GlassCard } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useAppSelector } from '../../hooks/redux';

function CustomerHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">{eyebrow}</p>
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
    </div>
  );
}

export function CustomerProfile() {
  const [avatar, setAvatar] = useState('');

  return (
    <section>
      <CustomerHeader eyebrow="Profile" title="Manage profile, image, and preferences" />
      <GlassCard className="p-6">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-gallery-red bg-gallery-rose p-6 text-center dark:bg-white/10">
            {avatar ? <img src={avatar} alt="Profile avatar" className="h-32 w-32 rounded-full object-cover" /> : <Camera className="h-12 w-12 text-gallery-red" />}
            <span className="mt-3 font-bold">Update profile image</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setAvatar(URL.createObjectURL(file));
            }} />
          </label>
          <div className="grid gap-4">
            <Input defaultValue="Shona Collector" placeholder="Full name" />
            <Input defaultValue="collector@shonaarts.com" placeholder="Email" />
            <Input placeholder="Shipping address" />
            <Button className="w-fit">Save profile</Button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

export function CustomerOrders() {
  const timeline = ['Order placed', 'Payment confirmed', 'Packed', 'Shipped', 'Delivered'];
  return (
    <section>
      <CustomerHeader eyebrow="Orders" title="Track order history and delivery" />
      <div className="space-y-4">
        {['#SA-1042', '#SA-1044'].map((order, index) => (
          <Card key={order} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div><h2 className="text-xl font-extrabold">{order}</h2><p className="text-zinc-500">Original painting - {index ? '$760' : '$420'}</p></div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 font-bold text-emerald-600"><PackageSearch className="h-4 w-4" /> {index ? 'Shipped' : 'Packed'}</span>
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-5">
              {timeline.map((step, stepIndex) => (
                <div key={step} className={`rounded-md p-3 text-sm font-bold ${stepIndex <= 2 + index ? 'bg-gallery-red text-white' : 'bg-gallery-rose text-gallery-ink dark:bg-white/10 dark:text-white'}`}>{step}</div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CustomerPayments() {
  return (
    <section>
      <CustomerHeader eyebrow="Payments" title="PayHere confirmations and history" />
      <div className="grid gap-4 md:grid-cols-3">
        {['Confirmed', 'Pending', 'Refunded'].map((status, index) => (
          <Card key={status} className="p-5">
            <CreditCard className="mb-4 h-7 w-7 text-gallery-red" />
            <p className="text-sm font-bold text-zinc-500">{status}</p>
            <p className="mt-2 text-3xl font-extrabold">{[4, 1, 0][index]}</p>
          </Card>
        ))}
      </div>
      <Button className="mt-6">Open secure PayHere checkout</Button>
    </section>
  );
}

export function CustomerSaved() {
  const wishlist = useAppSelector((state) => state.cart.wishlist);
  const fallback = useAppSelector((state) => state.artworks.items.slice(0, 2));
  const saved = wishlist.length ? wishlist : fallback;
  return (
    <section>
      <CustomerHeader eyebrow="Saved artworks" title="Wishlist and saved pieces" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {saved.map((artwork) => <ArtworkCard key={artwork._id} artwork={artwork} />)}
      </div>
    </section>
  );
}

export function CustomerWallPreview() {
  const [room, setRoom] = useState('');
  const artwork = useAppSelector((state) => state.artworks.items[0]);
  return (
    <section>
      <CustomerHeader eyebrow="AI wall preview" title="Upload a room and preview artwork scale" />
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <GlassCard className="p-6">
          <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-gallery-red p-8 text-center">
            <UploadCloud className="mb-3 h-10 w-10 text-gallery-red" />
            <span className="font-bold">Upload room image</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setRoom(URL.createObjectURL(file));
            }} />
          </label>
          <p className="mt-4 text-sm text-zinc-500">The preview overlays your selected artwork and helps estimate placement before checkout.</p>
        </GlassCard>
        <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {room ? <img src={room} alt="Room preview" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-zinc-500"><ImageUp className="h-16 w-16 text-gallery-red" /></div>}
          <img src={artwork.image} alt={artwork.title} className="absolute left-1/2 top-1/3 h-44 w-32 -translate-x-1/2 rounded border-8 border-white object-cover shadow-2xl" />
        </div>
      </div>
    </section>
  );
}

export function CustomerRecommendations() {
  const artworks = useAppSelector((state) => state.artworks.items);
  return (
    <section>
      <CustomerHeader eyebrow="AI recommendations" title="Curated based on style, wishlist, and bids" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {artworks.map((artwork) => <ArtworkCard key={artwork._id} artwork={artwork} />)}
      </div>
    </section>
  );
}

export function CustomerNotifications() {
  return (
    <section>
      <CustomerHeader eyebrow="Notifications" title="Order, auction, and custom artwork updates" />
      <div className="space-y-3">
        {[
          ['Auction winner announced', 'You won the Crimson Monsoon auction.'],
          ['Payment confirmed', 'Your PayHere payment was confirmed.'],
          ['Custom order approved', 'Your devotional artwork request moved to in progress.'],
        ].map(([title, message], index) => (
          <Card key={title} className="p-5">
            <div className="flex items-start gap-3">
              {index === 0 ? <Star className="h-6 w-6 text-gallery-red" /> : index === 1 ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Bell className="h-6 w-6 text-gallery-red" />}
              <div><h2 className="font-extrabold">{title}</h2><p className="text-zinc-500">{message}</p></div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
