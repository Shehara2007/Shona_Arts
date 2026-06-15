import { Clock, CreditCard, Gavel, Radio } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import { createPaymentSession, submitPayhereSession } from '../services/customerApi';
import { socket } from '../services/socket';
import { useAppSelector } from '../hooks/redux';
import type { Auction } from '../utils/types';

const winnerId = (auction: Auction) => {
  const winner = auction.currentWinner ?? auction.winner;
  return typeof winner === 'string' ? winner : winner?._id;
};

const secondsUntil = (endTime: string) => Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));

export function Auctions() {
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bidInputs, setBidInputs] = useState<Record<string, string>>({});
  const [now, setNow] = useState(Date.now());
  const redirectingAuction = useRef<string | null>(null);

  const loadAuctions = async () => {
    const { data } = await api.get<Auction[]>('/auctions');
    setAuctions(data);
  };

  useEffect(() => {
    void loadAuctions();
  }, []);

  useEffect(() => {
    socket.connect();
    auctions.forEach((auction) => socket.emit('joinAuction', auction._id));

    socket.on('bidUpdated', (payload: { auctionId: string; highestBid: number; currentWinner?: Auction['currentWinner']; bid?: { userId: string; bidderName?: string; amount: number; createdAt?: string } }) => {
      setAuctions((current) => current.map((auction) => (
        auction._id === payload.auctionId
          ? {
            ...auction,
            highestBid: payload.highestBid,
            currentWinner: payload.currentWinner,
            bidHistory: payload.bid ? [...(auction.bidHistory ?? []), payload.bid] : auction.bidHistory,
          }
          : auction
      )));
    });

    socket.on('bidRejected', (payload: { message: string }) => showToast(payload.message));

    return () => {
      socket.off('bidUpdated');
      socket.off('bidRejected');
      socket.disconnect();
    };
  }, [auctions, showToast]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const refresh = window.setInterval(() => void loadAuctions(), 15000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(refresh);
    };
  }, []);

  const visibleAuctions = useMemo(() => {
    return auctions.filter((auction) => auction.status === 'live' || winnerId(auction) === user?._id);
  }, [auctions, user?._id]);

  useEffect(() => {
    const endedWinningAuction = auctions.find((auction) => (
      winnerId(auction) === user?._id
      && auction.paymentStatus !== 'paid'
      && secondsUntil(auction.endTime) === 0
      && redirectingAuction.current !== auction._id
    ));

    if (!endedWinningAuction) return;
    redirectingAuction.current = endedWinningAuction._id;
    void createPaymentSession({ auctionId: endedWinningAuction._id })
      .then((session) => {
        showToast('You won. Opening PayHere sandbox checkout');
        submitPayhereSession(session);
      })
      .catch(() => {
        redirectingAuction.current = null;
        showToast('Payment is available when the auction closes.');
      });
  }, [auctions, now, showToast, user?._id]);

  const placeBid = (auction: Auction) => {
    if (!user) {
      showToast('Please log in to bid.');
      return;
    }
    const currentBid = Math.max(auction.highestBid || 0, auction.startingPrice || 0);
    const amount = Number(bidInputs[auction._id] || 0);
    if (amount <= currentBid) {
      showToast(`Bid must be higher than ${currentBid}.`);
      return;
    }
    socket.emit('placeBid', { auctionId: auction._id, amount, userId: user._id, bidderName: user.name });
    setBidInputs((current) => ({ ...current, [auction._id]: '' }));
  };

  const payForAuction = async (auctionId: string) => {
    const session = await createPaymentSession({ auctionId });
    showToast('Opening PayHere sandbox checkout');
    submitPayhereSession(session);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.18em] text-gallery-red"><Radio className="h-4 w-4" /> Live bidding</p>
        <h1 className="font-display text-5xl font-extrabold">Real-time art auctions</h1>
      </div>

      {!visibleAuctions.length && <p className="text-zinc-500">No live auction lots are available yet.</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        {visibleAuctions.map((auction) => {
          const artwork = auction.artworkId;
          const secondsLeft = secondsUntil(auction.endTime);
          const ended = secondsLeft === 0 || auction.status === 'closed';
          const isWinner = winnerId(auction) === user?._id;
          const currentBid = Math.max(auction.highestBid || 0, auction.startingPrice || 0);

          return (
            <article key={auction._id} className="overflow-hidden rounded-lg border border-red-100 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <img src={artwork.image} alt={artwork.title} className="h-80 w-full object-cover" />
              <div className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gallery-red">{auction.status}</p>
                    <h2 className="mt-1 text-2xl font-extrabold">{artwork.title}</h2>
                    <p className="mt-2 text-sm text-zinc-500">{artwork.description}</p>
                  </div>
                  <Gavel className="h-7 w-7 text-gallery-red" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-gallery-rose p-3 dark:bg-white/10">
                    <p className="text-xs font-bold uppercase text-zinc-500">Highest bid</p>
                    <p className="text-2xl font-extrabold text-gallery-red">${currentBid}</p>
                  </div>
                  <div className="rounded-md bg-gallery-rose p-3 dark:bg-white/10">
                    <p className="text-xs font-bold uppercase text-zinc-500">Bids</p>
                    <p className="text-2xl font-extrabold">{auction.bidHistory?.length ?? 0}</p>
                  </div>
                  <div className="rounded-md bg-gallery-rose p-3 dark:bg-white/10">
                    <p className="text-xs font-bold uppercase text-zinc-500">Time left</p>
                    <p className="text-2xl font-extrabold"><Clock className="mr-1 inline h-5 w-5" />{Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s</p>
                  </div>
                </div>

                {!ended ? (
                  <div className="mt-5 flex gap-3">
                    <input
                      type="number"
                      value={bidInputs[auction._id] ?? ''}
                      onChange={(event) => setBidInputs((current) => ({ ...current, [auction._id]: event.target.value }))}
                      placeholder={`Min ${currentBid + 1}`}
                      className="min-w-0 flex-1 rounded-md border border-red-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950"
                    />
                    <button type="button" onClick={() => placeBid(auction)} className="inline-flex items-center gap-2 rounded-md bg-gallery-red px-5 py-3 font-bold text-white">
                      <Gavel className="h-5 w-5" /> Bid
                    </button>
                  </div>
                ) : isWinner && auction.paymentStatus !== 'paid' ? (
                  <button type="button" onClick={() => payForAuction(auction._id)} className="mt-5 inline-flex items-center gap-2 rounded-md bg-gallery-red px-5 py-3 font-bold text-white">
                    <CreditCard className="h-5 w-5" /> Pay winning bid ${currentBid}
                  </button>
                ) : (
                  <p className="mt-5 font-bold text-zinc-500">{isWinner ? 'Winning bid paid.' : 'Auction ended.'}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
