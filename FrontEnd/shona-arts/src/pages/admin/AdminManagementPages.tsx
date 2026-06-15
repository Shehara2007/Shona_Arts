import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Ban,
  Box,
  CheckCircle2,
  CreditCard,
  Edit,
  Eye,
  Gavel,
  ImagePlus,
  Loader2,
  Plus,
  Shield,
  Star,
  Trash2,
  Truck,
  Upload,
  UserCog,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, GlassCard } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { uploadImage } from '../../services/api';
import {
  createAdminArtwork,
  createAdminNotification,
  createAdminAuction,
  deleteAdminAuction,
  deleteAdminArtwork,
  deleteAdminReview,
  deleteAdminUser,
  fetchAdminArtworks,
  fetchAdminAuctions,
  fetchAdminCustomOrders,
  fetchAdminNotifications,
  fetchAdminOrders,
  fetchAdminReviews,
  fetchAdminStats,
  fetchAdminUsers,
  updateAdminArtwork,
  updateAdminAuction,
  updateAdminCustomOrder,
  updateAdminOrder,
  updateAdminUser,
  type AdminAuction,
  type AdminCustomOrder,
  type AdminNotification,
  type AdminOrder,
  type AdminReview,
  type AdminStats,
  type AdminUser,
} from '../../services/adminApi';
import type { Artwork } from '../../utils/types';

function SectionHeader({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">{eyebrow}</p>
        <h2 className="font-display text-4xl font-extrabold">{title}</h2>
      </div>
      {action && (
        <Button onClick={onAction}>
          <Plus className="h-5 w-5" /> {action}
        </Button>
      )}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-zinc-300">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading from MongoDB...
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAdminStats()
      .then((data) => mounted && setStats(data))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const metrics: Array<[string, string | number]> = [
    ['Users', stats?.users ?? 0],
    ['Artworks', stats?.artworks ?? 0],
    ['Orders', stats?.orders ?? 0],
    ['Revenue', `$${(stats?.revenue ?? 0).toLocaleString()}`],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Admin</p>
          <h1 className="font-display text-5xl font-extrabold">Dashboard analytics</h1>
        </div>
        <Box className="h-12 w-12 text-gallery-red" />
      </div>
      {loading ? <LoadingBlock /> : null}
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
            <p className="text-sm font-bold text-zinc-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-extrabold">MongoDB-backed status</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Reviews', stats?.reviews ?? 0],
              ['Custom orders', stats?.customOrders ?? 0],
              ['Notifications', stats?.notifications ?? 0],
              ['Revenue from paid orders', `$${(stats?.revenue ?? 0).toLocaleString()}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-gallery-rose p-4 dark:bg-white/5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gallery-red">{label}</p>
                <p className="mt-2 text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-extrabold">Live admin areas</h2>
          <div className="mt-5 space-y-4">
            {['Manage users', 'Manage artworks', 'Manage orders', 'Manage auctions', 'Moderate reviews', 'Handle custom orders'].map((item) => (
              <div key={item} className="rounded-md border border-red-100 p-4 dark:border-white/10">
                <p className="font-bold">{item}</p>
                <p className="text-sm text-zinc-500">Data is now read from and written to MongoDB via `/api/admin` and protected painting routes.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', category: '', stock: '1', price: '0', image: '', artist: '', style: '', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      setArtworks(await fetchAdminArtworks());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', category: '', stock: '1', price: '0', image: '', artist: '', style: '', description: '' });
  };

  const handleImageFile = async (file?: File) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setForm((current) => ({ ...current, image: url }));
    } finally {
      setUploadingImage(false);
    }
  };

  const saveArtwork = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        stock: Number(form.stock),
        price: Number(form.price),
        images: form.image ? [form.image] : [],
        popularity: 0,
        reviews: [],
        bids: [],
      } as Partial<Artwork>;
      if (editingId) {
        await updateAdminArtwork(editingId, payload);
      } else {
        await createAdminArtwork(payload);
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeader eyebrow="Artwork management" title="Upload, edit, delete, and stock artworks" action="New artwork" onAction={resetForm} />
      <GlassCard className="mb-6 p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Artwork title" />
          <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category" />
          <Input value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="Stock quantity" type="number" min="0" />
          <Input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" type="number" min="0" />
          <Input value={form.artist} onChange={(event) => setForm({ ...form, artist: event.target.value })} placeholder="Artist" />
          <Input value={form.style} onChange={(event) => setForm({ ...form, style: event.target.value })} placeholder="Style" />
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed border-red-200 bg-white px-4 py-3 font-bold text-gallery-red transition hover:bg-gallery-rose dark:border-white/10 dark:bg-zinc-900 lg:col-span-2">
            <ImagePlus className="h-5 w-5" />
            {uploadingImage ? 'Uploading image...' : form.image ? 'Change image from device' : 'Add image from device'}
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => void handleImageFile(event.target.files?.[0])} />
          </label>
          {form.image && (
            <div className="overflow-hidden rounded-md border border-red-100 bg-white dark:border-white/10 dark:bg-zinc-900">
              <img src={form.image} alt="Artwork preview" className="h-32 w-full object-cover" />
            </div>
          )}
          <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="lg:col-span-2" />
          <Button onClick={saveArtwork} disabled={saving || uploadingImage || !form.image} className="lg:col-span-1">
            <Upload className="h-5 w-5" /> {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
          </Button>
        </div>
      </GlassCard>
      {loading ? <LoadingBlock /> : null}
      <div className="grid gap-4 xl:grid-cols-3">
        {artworks.map((artwork) => (
          <Card key={artwork._id} className="overflow-hidden bg-zinc-900 text-white">
            <img src={artwork.image} alt={artwork.title} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">{artwork.category}</p>
                  <h3 className="mt-1 text-xl font-extrabold">{artwork.title}</h3>
                  <p className="text-sm text-zinc-400">Stock: {artwork.stock} - ${artwork.price}</p>
                </div>
                <Box className="h-6 w-6 text-gallery-red" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  onClick={() => {
                    setEditingId(artwork._id);
                    setForm({
                      title: artwork.title,
                      category: artwork.category,
                      stock: String(artwork.stock),
                      price: String(artwork.price),
                      image: artwork.image,
                      artist: artwork.artist,
                      style: artwork.style,
                      description: artwork.description,
                    });
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="secondary" className="px-3 py-2" onClick={() => window.open(`/artworks/${artwork._id}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                <Button variant="danger" className="px-3 py-2" onClick={async () => { await deleteAdminArtwork(artwork._id); await load(); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminCatalog() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    void fetchAdminArtworks().then(setArtworks);
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    artworks.forEach((artwork) => map.set(artwork.category, (map.get(artwork.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [artworks]);

  return (
    <section>
      <SectionHeader eyebrow="Catalog controls" title="MongoDB artwork categories and stock" />
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map(([category, count]) => (
          <Card key={category} className="bg-zinc-900 p-5 text-white">
            <p className="text-sm font-bold text-red-200">Category</p>
            <h3 className="mt-1 text-2xl font-extrabold">{category}</h3>
            <p className="mt-3 text-zinc-400">{count} active artworks</p>
            <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gallery-red" style={{ width: `${Math.min(100, 20 + count * 12)}%` }} /></div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminAuctions() {
  const [auctions, setAuctions] = useState<AdminAuction[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ artworkId: '', startingPrice: '0', highestBid: '0', endTime: '', status: 'draft' as AdminAuction['status'] });

  const resetForm = (artworkId = artworks[0]?._id || '') => {
    setEditingId(null);
    setForm({ artworkId, startingPrice: '0', highestBid: '0', endTime: '', status: 'draft' });
  };

  const load = async () => {
    const [auctionData, artworkData] = await Promise.all([fetchAdminAuctions(), fetchAdminArtworks()]);
    setAuctions(auctionData);
    setArtworks(artworkData);
    setForm((current) => ({ ...current, artworkId: current.artworkId || artworkData[0]?._id || '' }));
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="Auction management" title="Create, edit, and delete auction lots" action={editingId ? 'Update lot' : 'Create auction'} onAction={async () => {
        const payload = { artworkId: form.artworkId, startingPrice: Number(form.startingPrice), highestBid: Number(form.highestBid), endTime: form.endTime, status: form.status };
        if (editingId) await updateAdminAuction(editingId, payload);
        else await createAdminAuction(payload);
        resetForm();
        await load();
      }} />
      <GlassCard className="mb-6 p-5">
        <div className="grid gap-4 lg:grid-cols-5">
          <select value={form.artworkId} onChange={(event) => setForm({ ...form, artworkId: event.target.value })} className="rounded-md border border-red-100 bg-white px-3 py-3 dark:border-white/10 dark:bg-zinc-900">
            {artworks.map((artwork) => <option key={artwork._id} value={artwork._id}>{artwork.title}</option>)}
          </select>
          <Input value={form.startingPrice} onChange={(event) => setForm({ ...form, startingPrice: event.target.value })} placeholder="Starting price" type="number" />
          <Input value={form.highestBid} onChange={(event) => setForm({ ...form, highestBid: event.target.value })} placeholder="Highest bid" type="number" />
          <Input value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} type="datetime-local" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminAuction['status'] })} className="rounded-md border border-red-100 bg-white px-3 py-3 dark:border-white/10 dark:bg-zinc-900">
            {['draft', 'live', 'closed'].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        {editingId && <Button variant="secondary" className="mt-4" onClick={() => resetForm()}>Cancel edit</Button>}
      </GlassCard>
      <div className="grid gap-4 lg:grid-cols-2">
        {auctions.map((lot, index) => (
          <Card key={lot._id} className="bg-zinc-900 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-red-200">Lot {index + 1}</p>
                <h3 className="text-2xl font-extrabold">{typeof lot.artworkId === 'string' ? lot.artworkId : lot.artworkId.title}</h3>
              </div>
              <Gavel className="h-7 w-7 text-gallery-red" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <span className="rounded-md bg-white/10 p-3"><strong>${lot.highestBid}</strong><br />Highest bid</span>
              <span className="rounded-md bg-white/10 p-3"><strong>{lot.bidHistory.length}</strong><br />Bid history</span>
              <span className="rounded-md bg-white/10 p-3"><strong>{new Date(lot.endTime).toLocaleString()}</strong><br />Ends</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const artworkId = typeof lot.artworkId === 'string' ? lot.artworkId : lot.artworkId._id;
                  setEditingId(lot._id);
                  setForm({
                    artworkId,
                    startingPrice: String(lot.startingPrice),
                    highestBid: String(lot.highestBid),
                    endTime: new Date(lot.endTime).toISOString().slice(0, 16),
                    status: lot.status,
                  });
                }}
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
              <Button variant="danger" onClick={async () => { await deleteAdminAuction(lot._id); await load(); }}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  const load = async () => setUsers(await fetchAdminUsers());

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="User management" title="Customers, blocking, and roles" />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
        {users.map((user) => (
          <div key={user.email} className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 md:grid-cols-[1fr_140px_130px_260px] md:items-center">
            <div>
              <p className="font-extrabold">{user.name}</p>
              <p className="text-sm text-zinc-400">{user.email}</p>
            </div>
            <p className="text-zinc-300">{user.orders.length} orders</p>
            <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${user.blocked ? 'bg-red-500/15 text-red-200' : 'bg-emerald-500/15 text-emerald-300'}`}>{user.blocked ? 'Blocked' : 'Active'}</span>
            <div className="flex flex-wrap gap-2">
              <select defaultValue={user.role} id={`role-${user._id}`} className="rounded-md border border-white/10 bg-white px-3 py-2 text-zinc-900 dark:bg-zinc-950 dark:text-white">
                {['customer', 'admin'].map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <select defaultValue={String(user.blocked)} id={`blocked-${user._id}`} className="rounded-md border border-white/10 bg-white px-3 py-2 text-zinc-900 dark:bg-zinc-950 dark:text-white">
                <option value="false">Active</option>
                <option value="true">Blocked</option>
              </select>
              <Button
                variant="secondary"
                className="px-3 py-2"
                onClick={async () => {
                  const role = (document.getElementById(`role-${user._id}`) as HTMLSelectElement | null)?.value as 'customer' | 'admin' | undefined;
                  const blocked = (document.getElementById(`blocked-${user._id}`) as HTMLSelectElement | null)?.value === 'true';
                  await updateAdminUser(user._id, { role, blocked });
                  await load();
                }}
              >
                <UserCog className="h-4 w-4" /> Save
              </Button>
              <Button variant="danger" className="px-3 py-2" onClick={async () => { await deleteAdminUser(user._id); await load(); }}><Ban className="h-4 w-4" /> Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const load = async () => setOrders(await fetchAdminOrders());

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="Order management" title="Delivery status and payment tracking" />
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order._id} className="bg-zinc-900 p-5 text-white">
            <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_220px] lg:items-center">
              <div>
                <strong>{typeof order.userId === 'string' ? order.userId : order.userId.name}</strong>
                <p className="text-sm text-zinc-400">${order.totalPrice} • {order.items.length} items</p>
              </div>
              <select defaultValue={order.orderStatus} id={`order-status-${order._id}`} className="rounded-md border border-white/10 bg-white px-3 py-2 text-zinc-900 dark:bg-zinc-950 dark:text-white">
                {['processing', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <select defaultValue={order.paymentStatus} id={`payment-status-${order._id}`} className="rounded-md border border-white/10 bg-white px-3 py-2 text-zinc-900 dark:bg-zinc-950 dark:text-white">
                {['pending', 'paid', 'failed'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <Button
                variant="secondary"
                onClick={async () => {
                  const orderStatus = (document.getElementById(`order-status-${order._id}`) as HTMLSelectElement | null)?.value as AdminOrder['orderStatus'];
                  const paymentStatus = (document.getElementById(`payment-status-${order._id}`) as HTMLSelectElement | null)?.value as AdminOrder['paymentStatus'];
                  await updateAdminOrder(order._id, { orderStatus, paymentStatus });
                  await load();
                }}
              >
                <Truck className="h-4 w-4" /> Update
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminPayments() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customOrders, setCustomOrders] = useState<AdminCustomOrder[]>([]);

  useEffect(() => {
    void Promise.all([fetchAdminStats(), fetchAdminOrders(), fetchAdminCustomOrders()]).then(([dashboard, orderData, customOrderData]) => {
      setStats(dashboard);
      setOrders(orderData);
      setCustomOrders(customOrderData);
    });
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="Payments" title="PayHere confirmations and payment history" />
      <div className="grid gap-4 md:grid-cols-3">
        {['Paid', 'Pending', 'Failed'].map((status) => {
          const count = orders.filter((order) => order.paymentStatus === status.toLowerCase()).length
            + customOrders.filter((order) => order.paymentStatus === status.toLowerCase()).length;
          return (
            <Card key={status} className="bg-zinc-900 p-6 text-white">
              <CreditCard className="mb-4 h-8 w-8 text-gallery-red" />
              <p className="text-sm font-bold text-zinc-400">{status} payments</p>
              <p className="mt-2 text-4xl font-extrabold">{count}</p>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-gallery-red">Revenue</p>
        <p className="mt-2 text-4xl font-extrabold">${(stats?.revenue ?? 0).toLocaleString()}</p>
      </div>
    </section>
  );
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);

  const load = async () => setReviews(await fetchAdminReviews());

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="Review management" title="Moderate ratings, images, and spam" />
      <div className="grid gap-4 lg:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review._id} className="bg-zinc-900 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex text-gallery-red">{Array.from({ length: review.rating }).map((_, star) => <Star key={star} className="h-4 w-4 fill-current" />)}</div>
                <p>{review.comment}</p>
                <p className="mt-2 text-sm text-zinc-400">{review.verifiedPurchase ? 'Verified purchase badge enabled' : 'Standard review'}</p>
              </div>
              {review.verifiedPurchase ? <BadgeCheck className="h-6 w-6 text-emerald-300" /> : <ImagePlus className="h-6 w-6 text-red-200" />}
            </div>
            <Button variant="danger" className="mt-5" onClick={async () => { await deleteAdminReview(review._id); await load(); }}>
              <Trash2 className="h-5 w-5" /> Remove spam
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminCustomOrders() {
  const [customOrders, setCustomOrders] = useState<AdminCustomOrder[]>([]);

  const load = async () => setCustomOrders(await fetchAdminCustomOrders());

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="Custom orders" title="View payments and track progress" />
      <div className="grid gap-4">
        {customOrders.map((order) => (
          <Card key={order._id} className="bg-zinc-900 p-5 text-white">
            <div className="grid gap-4 lg:grid-cols-[1fr_140px_140px_180px_220px] lg:items-center">
              <div>
                <h3 className="text-xl font-extrabold">{order.artStyle}</h3>
                <p className="text-zinc-400">{typeof order.userId === 'string' ? order.userId : order.userId.name}</p>
              </div>
              <span>${order.budget}</span>
              <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${order.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-300' : order.paymentStatus === 'failed' ? 'bg-red-500/15 text-red-200' : 'bg-amber-500/15 text-amber-200'}`}>
                {order.paymentStatus}
              </span>
              <select defaultValue={order.status} id={`custom-status-${order._id}`} className="rounded-md border border-white/10 bg-white px-3 py-2 text-zinc-900 dark:bg-zinc-950 dark:text-white">
                {['pending', 'approved', 'in-progress', 'completed', 'rejected'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <Button
                onClick={async () => {
                  const status = (document.getElementById(`custom-status-${order._id}`) as HTMLSelectElement | null)?.value as AdminCustomOrder['status'];
                  await updateAdminCustomOrder(order._id, status);
                  await load();
                }}
              >
                <CheckCircle2 className="h-5 w-5" /> Save
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState({ userId: '', title: '', message: '' });

  const load = async () => {
    const [notificationData, userData] = await Promise.all([fetchAdminNotifications(), fetchAdminUsers()]);
    setNotifications(notificationData);
    setUsers(userData);
    setForm((current) => ({ ...current, userId: current.userId || userData[0]?._id || '' }));
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <SectionHeader eyebrow="Notifications" title="Send and audit customer/admin alerts" action="Send alert" onAction={async () => {
        await createAdminNotification(form);
        setForm({ userId: users[0]?._id || '', title: '', message: '' });
        await load();
      }} />
      <GlassCard className="mb-6 p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <select value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} className="rounded-md border border-red-100 bg-white px-3 py-3 dark:border-white/10 dark:bg-zinc-900">
            {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
          </select>
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Title" />
          <Input value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Message" />
        </div>
      </GlassCard>
      <div className="grid gap-4 md:grid-cols-2">
        {notifications.map((notification) => (
          <Card key={notification._id} className="bg-zinc-900 p-5 text-white">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-gallery-red" />
              <div>
                <h3 className="font-extrabold">{notification.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{notification.message}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-red-200">{notification.isRead ? 'Read' : 'Unread'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
