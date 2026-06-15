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
  currentWinner?: string | { _id: string; name: string; email: string };
  endTime: string;
  winner?: string | { _id: string; name: string; email: string };
  paymentStatus?: 'pending' | 'paid' | 'failed';
  status: 'draft' | 'live' | 'closed';
  bidHistory?: Bid[];
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

export interface CustomOrder {
  _id: string;
  userId: string;
  referenceImage: string;
  artStyle: string;
  notes: string;
  budget: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
}

export interface PayhereSession {
  action_url: string;
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url?: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
