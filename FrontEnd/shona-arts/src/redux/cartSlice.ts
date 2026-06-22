import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Artwork, CartItem } from '../utils/types';

interface CartState {
  items: CartItem[];
  wishlist: Artwork[];
}

const loadCartState = (): CartState => {
  try {
    const saved = localStorage.getItem('shona_cart');
    return saved ? JSON.parse(saved) as CartState : { items: [], wishlist: [] };
  } catch {
    return { items: [], wishlist: [] };
  }
};

const saveCartState = (state: CartState) => {
  localStorage.setItem('shona_cart', JSON.stringify({ items: state.items, wishlist: state.wishlist }));
};

const initialState: CartState = loadCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Artwork>) => {
      if (action.payload.stock <= 0) return;
      const existing = state.items.find((item) => item.artwork._id === action.payload._id);
      if (existing) existing.quantity = Math.min(action.payload.stock, existing.quantity + 1);
      else state.items.push({ artwork: action.payload, quantity: 1 });
      saveCartState(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.artwork._id !== action.payload);
      saveCartState(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((entry) => entry.artwork._id === action.payload.id);
      if (item) item.quantity = Math.min(item.artwork.stock, Math.max(1, action.payload.quantity));
      saveCartState(state);
    },
    toggleWishlist: (state, action: PayloadAction<Artwork>) => {
      const exists = state.wishlist.some((item) => item._id === action.payload._id);
      state.wishlist = exists
        ? state.wishlist.filter((item) => item._id !== action.payload._id)
        : [...state.wishlist, action.payload];
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartState(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
