import {
  BadgeCheck,
  Ban,
  Box,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit,
  Eye,
  Gavel,
  ImagePlus,
  PauseCircle,
  Plus,
  Shield,
  Star,
  Trash2,
  Truck,
  Upload,
  UserCog,
  XCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, GlassCard } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useAppSelector } from '../../hooks/redux';

const customers = [
  { name: 'Amani Dias', email: 'amani@example.com', status: 'Active', role: 'customer', orders: 8 },
  { name: 'Ravi Fernando', email: 'ravi@example.com', status: 'Blocked', role: 'customer', orders: 2 },
  { name: 'Nila Jay', email: 'nila@example.com', status: 'Active', role: 'admin', orders: 14 },
];

const orders = [
  { id: '#SA-1042', customer: 'Amani Dias', status: 'Packed', payment: 'Paid', total: '$420' },
  { id: '#SA-1043', customer: 'Ravi Fernando', status: 'Processing', payment: 'Pending', total: '$180' },
  { id: '#SA-1044', customer: 'Nila Jay', status: 'Shipped', payment: 'Paid', total: '$760' },
];

const customOrders = [
  { title: 'Devotional lotus portrait', customer: 'Amani Dias', budget: '$250', status: 'Pending' },
  { title: 'Spiritual wall mural', customer: 'Ravi Fernando', budget: '$900', status: 'In progress' },
  { title: 'Family temple scene', customer: 'Nila Jay', budget: '$480', status: 'Approved' },
];

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">{eyebrow}</p>
        <h2 className="font-display text-4xl font-extrabold">{title}</h2>
      </div>
      {action && <Button><Plus className="h-5 w-5" /> {action}</Button>}
    </div>
  );
}

export function AdminArtworks() {
  const artworks = useAppSelector((state) => state.artworks.items);

  return (
    <section>
      <SectionHeader eyebrow="Artwork management" title="Upload, edit, delete, and stock artworks" action="Upload painting" />
      <GlassCard className="mb-6 p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <Input placeholder="Artwork title" />
          <Input placeholder="Category" />
          <Input placeholder="Stock quantity" type="number" />
          <Button><Upload className="h-5 w-5" /> Save</Button>
        </div>
      </GlassCard>
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
                <Button variant="secondary" className="px-3 py-2"><Eye className="h-4 w-4" /></Button>
                <Button variant="secondary" className="px-3 py-2"><Edit className="h-4 w-4" /></Button>
                <Button variant="danger" className="px-3 py-2"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminCatalog() {
  return (
    <section>
      <SectionHeader eyebrow="Catalog controls" title="Manage categories, styles, and stock" action="Add category" />
      <div className="grid gap-4 md:grid-cols-3">
        {['Painting', 'Digital Art', 'Commission', 'Devotional', 'Abstract', 'Realism'].map((category, index) => (
          <Card key={category} className="bg-zinc-900 p-5 text-white">
            <p className="text-sm font-bold text-red-200">Category</p>
            <h3 className="mt-1 text-2xl font-extrabold">{category}</h3>
            <p className="mt-3 text-zinc-400">{18 - index} active artworks</p>
            <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gallery-red" style={{ width: `${88 - index * 9}%` }} /></div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminAuctions() {
  return (
    <section>
      <SectionHeader eyebrow="Auction management" title="Create auctions, approve bids, and end lots" action="Create auction" />
      <div className="grid gap-4 lg:grid-cols-2">
        {['Crimson Monsoon', 'Lotus Signal', 'Temple Street Study'].map((lot, index) => (
          <Card key={lot} className="bg-zinc-900 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-red-200">Lot {index + 1}</p>
                <h3 className="text-2xl font-extrabold">{lot}</h3>
              </div>
              <Gavel className="h-7 w-7 text-gallery-red" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <span className="rounded-md bg-white/10 p-3"><strong>${320 + index * 120}</strong><br />Highest bid</span>
              <span className="rounded-md bg-white/10 p-3"><strong>{12 + index}</strong><br />Bid history</span>
              <span className="rounded-md bg-white/10 p-3"><strong>02:4{index}:10</strong><br />Countdown</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button><CheckCircle2 className="h-5 w-5" /> Approve bids</Button>
              <Button variant="secondary"><PauseCircle className="h-5 w-5" /> End auction</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminUsers() {
  return (
    <section>
      <SectionHeader eyebrow="User management" title="Customers, blocking, and roles" />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
        {customers.map((customer) => (
          <div key={customer.email} className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 md:grid-cols-[1fr_1fr_120px_220px] md:items-center">
            <div><p className="font-extrabold">{customer.name}</p><p className="text-sm text-zinc-400">{customer.email}</p></div>
            <p className="text-zinc-300">{customer.orders} orders</p>
            <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${customer.status === 'Active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-200'}`}>{customer.status}</span>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3 py-2"><UserCog className="h-4 w-4" /> Role</Button>
              <Button variant="danger" className="px-3 py-2"><Ban className="h-4 w-4" /> Block</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminOrders() {
  return (
    <section>
      <SectionHeader eyebrow="Order management" title="Delivery status and payment tracking" />
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-zinc-900 p-5 text-white">
            <div className="grid gap-4 lg:grid-cols-[120px_1fr_1fr_1fr_auto] lg:items-center">
              <strong>{order.id}</strong>
              <span>{order.customer}</span>
              <span className="inline-flex items-center gap-2 text-red-200"><Truck className="h-4 w-4" /> {order.status}</span>
              <span className="inline-flex items-center gap-2 text-emerald-300"><CreditCard className="h-4 w-4" /> {order.payment} - {order.total}</span>
              <Button variant="secondary">Update delivery</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminPayments() {
  return (
    <section>
      <SectionHeader eyebrow="Payments" title="PayHere confirmations and payment history" />
      <div className="grid gap-4 md:grid-cols-3">
        {['Paid', 'Pending', 'Failed'].map((status, index) => (
          <Card key={status} className="bg-zinc-900 p-6 text-white">
            <CreditCard className="mb-4 h-8 w-8 text-gallery-red" />
            <p className="text-sm font-bold text-zinc-400">{status} payments</p>
            <p className="mt-2 text-4xl font-extrabold">{[42, 9, 2][index]}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminReviews() {
  return (
    <section>
      <SectionHeader eyebrow="Review management" title="Moderate ratings, images, and spam" />
      <div className="grid gap-4 lg:grid-cols-2">
        {['Beautiful texture and fast delivery.', 'Suspicious duplicate review.', 'Verified purchase, excellent framing.'].map((review, index) => (
          <Card key={review} className="bg-zinc-900 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex text-gallery-red">{Array.from({ length: 5 }).map((_, star) => <Star key={star} className="h-4 w-4 fill-current" />)}</div>
                <p>{review}</p>
                <p className="mt-2 text-sm text-zinc-400">{index === 2 ? 'Verified purchase badge enabled' : 'Review image attached'}</p>
              </div>
              {index === 2 ? <BadgeCheck className="h-6 w-6 text-emerald-300" /> : <ImagePlus className="h-6 w-6 text-red-200" />}
            </div>
            <Button variant="danger" className="mt-5"><Trash2 className="h-5 w-5" /> Remove spam</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminCustomOrders() {
  return (
    <section>
      <SectionHeader eyebrow="Custom orders" title="Accept, reject, and track progress" />
      <div className="grid gap-4">
        {customOrders.map((order) => (
          <Card key={order.title} className="bg-zinc-900 p-5 text-white">
            <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_260px] lg:items-center">
              <div><h3 className="text-xl font-extrabold">{order.title}</h3><p className="text-zinc-400">{order.customer}</p></div>
              <span>{order.budget}</span>
              <span className="inline-flex items-center gap-2 text-red-200"><Clock className="h-4 w-4" /> {order.status}</span>
              <div className="flex gap-2">
                <Button><CheckCircle2 className="h-5 w-5" /> Accept</Button>
                <Button variant="danger"><XCircle className="h-5 w-5" /> Reject</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AdminNotifications() {
  return (
    <section>
      <SectionHeader eyebrow="Notifications" title="Automated customer and admin alerts" action="Send alert" />
      <div className="grid gap-4 md:grid-cols-2">
        {['Order paid successfully', 'Auction winner announced', 'Custom request approved', 'Low stock warning'].map((message) => (
          <Card key={message} className="bg-zinc-900 p-5 text-white">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-gallery-red" />
              <div><h3 className="font-extrabold">{message}</h3><p className="mt-1 text-sm text-zinc-400">Stored in notification collection and ready for email queue.</p></div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
