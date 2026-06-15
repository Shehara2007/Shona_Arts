import type { Server, Socket } from 'socket.io';
import { Auction } from '../models/Auction.js';

export function registerAuctionSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('joinAuction', (auctionId: string) => {
      socket.join(`auction:${auctionId}`);
    });

    socket.on('placeBid', async ({ auctionId, amount, userId, bidderName }: { auctionId: string; amount: number; userId?: string; bidderName?: string }) => {
      if (!userId) {
        socket.emit('bidRejected', { auctionId, message: 'Please log in to bid.' });
        return;
      }

      const auction = await Auction.findById(auctionId);
      if (!auction) {
        socket.emit('bidRejected', { auctionId, message: 'Auction not found.' });
        return;
      }

      if (auction.status !== 'live' || auction.endTime <= new Date()) {
        if (auction.status === 'live') {
          await Auction.findByIdAndUpdate(auctionId, { status: 'closed', winner: auction.currentWinner });
        }
        socket.emit('bidRejected', { auctionId, message: 'This auction has ended.' });
        return;
      }

      const minimumBid = Math.max(auction.highestBid || 0, auction.startingPrice || 0) + 1;
      if (amount < minimumBid) {
        socket.emit('bidRejected', { auctionId, message: `Bid must be at least ${minimumBid}.` });
        return;
      }

      const updated = await Auction.findByIdAndUpdate(
        auctionId,
        {
          highestBid: amount,
          currentWinner: userId,
          $push: { bidHistory: { userId, bidderName, amount } },
        },
        { new: true },
      ).populate('currentWinner', 'name email');

      io.to(`auction:${auctionId}`).emit('bidUpdated', {
        auctionId,
        highestBid: updated?.highestBid ?? amount,
        currentWinner: updated?.currentWinner,
        bid: { userId, bidderName, amount, createdAt: new Date().toISOString() },
      });
    });
  });
}
