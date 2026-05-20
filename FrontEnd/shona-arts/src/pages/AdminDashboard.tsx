import { BarChart3, Boxes, CreditCard, Gavel, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

export function AdminDashboard() {
  const artworks = useAppSelector((state) => state.artworks.items);
  const metrics: Array<[LucideIcon, string, string | number]> = [
    [Users, 'Users', 128],
    [Boxes, 'Artworks', artworks.length],
    [Gavel, 'Live auctions', 4],
    [CreditCard, 'Payments', '$18.4k'],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Admin</p>
          <h1 className="font-display text-5xl font-extrabold">Dashboard analytics</h1>
        </div>
        <BarChart3 className="h-12 w-12 text-gallery-red" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(([Icon, label, value]) => (
          <div key={String(label)} className="rounded-lg bg-white p-5 shadow-sm dark:bg-zinc-900">
            <Icon className="mb-4 h-6 w-6 text-gallery-red" />
            <p className="text-sm font-bold text-zinc-500">{String(label)}</p>
            <p className="mt-1 text-3xl font-extrabold">{String(value)}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-extrabold">Revenue statistics</h2>
          <div className="mt-5 flex h-56 items-end gap-3">
            {[42, 68, 55, 90, 74, 100, 83].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-gradient-to-t from-gallery-red to-red-300" style={{ height: `${height}%` }} />
                <span className="text-xs font-bold text-zinc-500">D{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-extrabold">User growth</h2>
          <div className="mt-5 space-y-4">
            {['Collectors', 'Artists', 'Returning buyers'].map((label, index) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{82 - index * 14}%</span></div>
                <div className="h-3 rounded-full bg-gallery-rose dark:bg-white/10"><div className="h-full rounded-full bg-gallery-red" style={{ width: `${82 - index * 14}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        {['Manage users', 'Manage artworks', 'Manage orders', 'Manage auctions', 'Approve bids', 'Custom artwork requests'].map((item) => (
          <div key={item} className="rounded-lg border border-red-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
            <h2 className="text-xl font-extrabold">{item}</h2>
            <p className="mt-2 text-zinc-500">Connected to protected admin API routes with role-based access control.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
