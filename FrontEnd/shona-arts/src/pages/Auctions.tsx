import { Gavel, Radio } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { socket } from '../services/socket';
import { useAppSelector } from '../hooks/redux';

export function Auctions() {
  const artwork = useAppSelector((state) => state.artworks.items[0]);
  const [highestBid, setHighestBid] = useState(artwork.price + 25);
  const [amount, setAmount] = useState(highestBid + 10);
  const auctionId = 'demo-auction';
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const bids = useMemo(() => [{ name: 'Current highest bid', amount: highestBid }], [highestBid]);

  useEffect(() => {
    socket.connect();
    socket.emit('joinAuction', auctionId);
    socket.on('bidUpdated', (payload: { auctionId: string; highestBid: number }) => {
      if (payload.auctionId === auctionId) setHighestBid(payload.highestBid);
    });
    return () => {
      socket.off('bidUpdated');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const placeBid = () => {
    const nextBid = Math.max(amount, highestBid + 1);
    setHighestBid(nextBid);
    setAmount(nextBid + 10);
    socket.emit('placeBid', { auctionId, amount: nextBid });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.18em] text-gallery-red"><Radio className="h-4 w-4" /> Live bidding</p>
        <h1 className="font-display text-5xl font-extrabold">Real-time art auctions</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <img src={artwork.image} alt={artwork.title} className="h-[620px] w-full rounded-lg object-cover" />
        <div className="glass rounded-lg p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gallery-red">Auction lot</p>
          <h2 className="mt-2 text-3xl font-extrabold">{artwork.title}</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">{artwork.description}</p>
          <div className="mt-8 rounded-lg bg-white p-5 dark:bg-zinc-950/60">
            <p className="text-sm font-bold text-zinc-500">Highest bid</p>
            <p className="text-5xl font-extrabold text-gallery-red">${highestBid}</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              ['Hours', Math.floor(secondsLeft / 3600)],
              ['Minutes', Math.floor((secondsLeft % 3600) / 60)],
              ['Seconds', secondsLeft % 60],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-md bg-gallery-rose p-3 dark:bg-white/10">
                <p className="text-2xl font-extrabold">{String(value).padStart(2, '0')}</p>
                <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="min-w-0 flex-1 rounded-md border border-red-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900" />
            <button type="button" onClick={placeBid} className="inline-flex items-center gap-2 rounded-md bg-gallery-red px-5 py-3 font-bold text-white">
              <Gavel className="h-5 w-5" /> Bid
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {[...bids, { name: 'Maya P.', amount: highestBid - 20 }, { name: 'Collector 18', amount: highestBid - 45 }].map((bid) => (
              <div key={`${bid.name}-${bid.amount}`} className="flex justify-between rounded-md bg-white px-4 py-3 dark:bg-zinc-950/60">
                <span>{bid.name}</span><strong>${bid.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
