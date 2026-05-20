import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Artwork, CartItem } from '../utils/types';

interface CartState {
  items: CartItem[];
  wishlist: Artwork[];
}

const initialState: CartState = { items: [], wishlist: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Artwork>) => {
      const existing = state.items.find((item) => item.artwork._id === action.payload._id);
      if (existing) existing.quantity += 1;
      else state.items.push({ artwork: action.payload, quantity: 1 });
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.artwork._id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((entry) => entry.artwork._id === action.payload.id);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    toggleWishlist: (state, action: PayloadAction<Artwork>) => {
      const exists = state.wishlist.some((item) => item._id === action.payload._id);
      state.wishlist = exists
        ? state.wishlist.filter((item) => item._id !== action.payload._id)
        : [...state.wishlist, action.payload];
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
