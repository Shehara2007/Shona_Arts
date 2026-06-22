import { Bell, Camera, CheckCircle2, CreditCard, ImageUp, PackageSearch, Star, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArtworkCard } from '../../components/ArtworkCard';
import { useToast } from '../../components/Toast';
import { Button } from '../../components/ui/button';
import { Card, GlassCard } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { hydrateUser } from '../../redux/authSlice';
import { createPaymentSession, fetchMyCustomOrders, fetchMyOrders, fetchNotifications, fetchRecommendations, markNotificationRead, submitPayhereSession, updateMe } from '../../services/customerApi';
import type { Artwork, CustomOrder, Notification, Order } from '../../utils/types';

function CustomerHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">{eyebrow}</p>
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
    </div>
  );
}

const orderTrackingSteps = ['Placed', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered'];
const customTrackingSteps = ['Requested', 'Paid', 'Approved', 'In progress', 'Completed'];

function orderStepIndex(order: Order) {
  if (order.orderStatus === 'cancelled') return 0;
  if (order.orderStatus === 'delivered') return 5;
  if (order.orderStatus === 'shipped') return 4;
  if (order.orderStatus === 'packed') return 3;
  if (order.paymentStatus === 'paid') return 2;
  return 0;
}

function customStepIndex(order: CustomOrder) {
  if (order.status === 'rejected') return 0;
  if (order.status === 'completed') return 4;
  if (order.status === 'in-progress') return 3;
  if (order.status === 'approved') return 2;
  if (order.paymentStatus === 'paid') return 1;
  return 0;
}

function StatusPill({ label, tone = 'neutral' }: { label: ReactNode; tone?: 'success' | 'warning' | 'danger' | 'neutral' }) {
  const classes = {
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/10 text-amber-600',
    danger: 'bg-red-500/10 text-red-600',
    neutral: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300',
  };
  return <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${classes[tone]}`}>{label}</span>;
}

export function CustomerProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', avatar: user?.avatar ?? '' });

  useEffect(() => {
    setForm({ name: user?.name ?? '', email: user?.email ?? '', avatar: user?.avatar ?? '' });
  }, [user]);

  const save = async () => {
    const updated = await updateMe(form);
    dispatch(hydrateUser(updated));
    showToast('Profile saved');
  };

  return (
    <section>
      <CustomerHeader eyebrow="Profile" title="Manage profile, image, and preferences" />
      <GlassCard className="p-6">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-gallery-red bg-gallery-rose p-6 text-center dark:bg-white/10">
            {form.avatar ? <img src={form.avatar} alt="Profile avatar" className="h-32 w-32 rounded-full object-cover" /> : <Camera className="h-12 w-12 text-gallery-red" />}
            <span className="mt-3 font-bold">Update profile image</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setForm((current) => ({ ...current, avatar: URL.createObjectURL(file) }));
            }} />
          </label>
          <div className="grid gap-4">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" />
            <Input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
            <Input placeholder="Shipping address" />
            <Button className="w-fit" onClick={save}>Save profile</Button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

export function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    void Promise.all([fetchMyOrders(), fetchMyCustomOrders()]).then(([orderData, customOrderData]) => {
      setOrders(orderData);
      setCustomOrders(customOrderData);
    });
  }, []);

  return (
    <section>
      <CustomerHeader eyebrow="Orders" title="Track order history and delivery" />
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-extrabold">#{order._id.slice(-6).toUpperCase()}</h2>
                <p className="text-zinc-500">${order.totalPrice} - {order.items.length} items - {order.shippingAddress}</p>
                <p className="mt-1 text-sm text-zinc-500">Last update: {new Date(order.updatedAt ?? order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={`Payment: ${order.paymentStatus}`} tone={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'} />
                <StatusPill label={<><PackageSearch className="h-4 w-4" /> {order.orderStatus}</>} tone={order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'neutral'} />
              </div>
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-6">
              {orderTrackingSteps.map((step, stepIndex) => (
                <div key={step} className={`rounded-md p-3 text-sm font-bold ${stepIndex <= orderStepIndex(order) && order.orderStatus !== 'cancelled' ? 'bg-gallery-red text-white' : 'bg-gallery-rose text-gallery-ink dark:bg-white/10 dark:text-white'}`}>{step}</div>
              ))}
            </div>
            {order.orderStatus === 'cancelled' && <p className="mt-3 font-semibold text-red-600">This order was cancelled.</p>}
          </Card>
        ))}
        {customOrders.map((order) => (
          <Card key={order._id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-extrabold">Custom #{order._id.slice(-6).toUpperCase()}</h2>
                <p className="text-zinc-500">{order.artStyle} - ${order.budget}</p>
                <p className="mt-1 text-sm text-zinc-500">Last update: {new Date(order.updatedAt ?? order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={`Payment: ${order.paymentStatus}`} tone={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'} />
                <StatusPill label={`Custom: ${order.status}`} tone={order.status === 'completed' ? 'success' : order.status === 'rejected' ? 'danger' : 'neutral'} />
              </div>
              {order.paymentStatus === 'pending' && order.status !== 'rejected' && (
                <Button
                  onClick={async () => {
                    const session = await createPaymentSession({ customOrderId: order._id });
                    showToast('Opening PayHere sandbox checkout');
                    submitPayhereSession(session);
                  }}
                >
                  Pay custom order
                </Button>
              )}
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-5">
              {customTrackingSteps.map((step, stepIndex) => (
                <div key={step} className={`rounded-md p-3 text-sm font-bold ${stepIndex <= customStepIndex(order) && order.status !== 'rejected' ? 'bg-gallery-red text-white' : 'bg-gallery-rose text-gallery-ink dark:bg-white/10 dark:text-white'}`}>{step}</div>
              ))}
            </div>
            {order.status === 'rejected' && <p className="mt-3 font-semibold text-red-600">This custom order was rejected.</p>}
          </Card>
        ))}
        {!orders.length && !customOrders.length && <Card className="p-5 text-zinc-500">No orders yet.</Card>}
      </div>
    </section>
  );
}

export function CustomerPayments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    void Promise.all([fetchMyOrders(), fetchMyCustomOrders()]).then(([orderData, customOrderData]) => {
      setOrders(orderData);
      setCustomOrders(customOrderData);
    });
  }, []);

  const openCheckout = async () => {
    const pending = orders.find((order) => order.paymentStatus === 'pending');
    const pendingCustom = customOrders.find((order) => order.paymentStatus === 'pending');
    if (!pending && !pendingCustom) {
      showToast('No pending payments');
      return;
    }
    const session = pending
      ? await createPaymentSession({ orderId: pending._id })
      : await createPaymentSession({ customOrderId: pendingCustom?._id });
    showToast('Opening PayHere sandbox checkout');
    submitPayhereSession(session);
  };

  return (
    <section>
      <CustomerHeader eyebrow="Payments" title="PayHere confirmations and history" />
      <div className="grid gap-4 md:grid-cols-3">
        {['Confirmed', 'Pending', 'Refunded'].map((status, index) => (
          <Card key={status} className="p-5">
            <CreditCard className="mb-4 h-7 w-7 text-gallery-red" />
            <p className="text-sm font-bold text-zinc-500">{status}</p>
            <p className="mt-2 text-3xl font-extrabold">{[
              orders.filter((order) => order.paymentStatus === 'paid').length + customOrders.filter((order) => order.paymentStatus === 'paid').length,
              orders.filter((order) => order.paymentStatus === 'pending').length + customOrders.filter((order) => order.paymentStatus === 'pending').length,
              orders.filter((order) => order.paymentStatus === 'failed').length + customOrders.filter((order) => order.paymentStatus === 'failed').length,
            ][index]}</p>
          </Card>
        ))}
      </div>
      <Button className="mt-6" onClick={openCheckout}>Open secure PayHere checkout</Button>
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
          {artwork && <img src={artwork.image} alt={artwork.title} className="absolute left-1/2 top-1/3 h-44 w-32 -translate-x-1/2 rounded border-8 border-white object-cover shadow-2xl" />}
        </div>
      </div>
    </section>
  );
}

export function CustomerRecommendations() {
  const artworks = useAppSelector((state) => state.artworks.items);
  const [recommendations, setRecommendations] = useState<Artwork[]>([]);

  useEffect(() => {
    void fetchRecommendations({ artworkId: artworks[0]?._id, style: artworks[0]?.style }).then(setRecommendations);
  }, [artworks]);

  return (
    <section>
      <CustomerHeader eyebrow="AI recommendations" title="Curated based on style, wishlist, and bids" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(recommendations.length ? recommendations : artworks).map((artwork) => <ArtworkCard key={artwork._id} artwork={artwork} />)}
      </div>
    </section>
  );
}

export function CustomerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = async () => setNotifications(await fetchNotifications());

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <CustomerHeader eyebrow="Notifications" title="Order, auction, and custom artwork updates" />
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <Card key={notification._id} className="p-5">
            <div className="flex items-start gap-3">
              {index === 0 ? <Star className="h-6 w-6 text-gallery-red" /> : index === 1 ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Bell className="h-6 w-6 text-gallery-red" />}
              <div className="flex-1"><h2 className="font-extrabold">{notification.title}</h2><p className="text-zinc-500">{notification.message}</p></div>
              {!notification.isRead && <Button variant="secondary" onClick={async () => { await markNotificationRead(notification._id); await load(); }}>Mark read</Button>}
            </div>
          </Card>
        ))}
        {!notifications.length && <Card className="p-5 text-zinc-500">No notifications yet.</Card>}
      </div>
    </section>
  );
}
