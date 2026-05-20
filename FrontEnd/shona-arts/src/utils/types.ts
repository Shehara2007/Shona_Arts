export type Role = 'customer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  wishlist: string[];
}

export interface Review {
  _id: string;
  userId: string;
  artworkId: string;
  rating: number;
  comment: string;
  images?: string[];
  verifiedPurchase?: boolean;
  createdAt?: string;
}

export interface Bid {
  userId: string;
  amount: number;
  bidderName?: string;
  createdAt?: string;
}

export interface Artwork {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  stock: number;
  artist: string;
  style: string;
  popularity: number;
  featured?: boolean;
  reviews: Review[];
  bids: Bid[];
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface Auction {
  _id: string;
  artworkId: Artwork;
  startingPrice: number;
  highestBid: number;
  endTime: string;
  winner?: string;
  status: 'draft' | 'live' | 'closed';
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  totalPrice: number;
  orderStatus: 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
