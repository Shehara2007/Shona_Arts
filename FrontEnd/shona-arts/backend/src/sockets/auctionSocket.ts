import type { Server, Socket } from 'socket.io';
import { Auction } from '../models/Auction.js';

export function registerAuctionSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('joinAuction', (auctionId: string) => {
      socket.join(`auction:${auctionId}`);
    });

    socket.on('placeBid', async ({ auctionId, amount, userId }: { auctionId: string; amount: number; userId?: string }) => {
      if (auctionId !== 'demo-auction' && userId) {
        await Auction.findByIdAndUpdate(auctionId, {
          $max: { highestBid: amount },
          currentWinner: userId,
          $push: { bidHistory: { userId, amount } },
        });
      }
      io.to(`auction:${auctionId}`).emit('bidUpdated', { auctionId, highestBid: amount, userId });
    });
  });
}
