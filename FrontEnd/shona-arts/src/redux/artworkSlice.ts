import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api';
import type { Artwork } from '../utils/types';

interface ArtworkState {
  items: Artwork[];
  selected?: Artwork;
  loading: boolean;
}

export const fetchArtworks = createAsyncThunk('artworks/fetch', async (query?: string) => {
  const { data } = await api.get<Artwork[] | { data: Artwork[] }>(`/paintings${query ? `?${query}` : ''}`);
  return Array.isArray(data) ? data : data.data;
});

export const fetchArtwork = createAsyncThunk('artworks/fetchOne', async (id: string) => {
  const { data } = await api.get<Artwork>(`/paintings/${id}`);
  return data;
});

const demoArtworks: Artwork[] = [
  {
    _id: 'demo-1',
    title: 'Crimson Monsoon',
    category: 'Painting',
    description: 'Layered acrylic textures inspired by warm rain and city windows.',
    price: 175,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80',
    ],
    stock: 4,
    artist: 'Maya Perera',
    style: 'Abstract',
    popularity: 97,
    featured: true,
    reviews: [],
    bids: [],
  },
  {
    _id: 'demo-2',
    title: 'Lotus Signal',
    category: 'Digital Art',
    description: 'A vivid digital composition for contemporary interiors.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80'],
    stock: 12,
    artist: 'Nethmi Silva',
    style: 'Modern',
    popularity: 91,
    featured: true,
    reviews: [],
    bids: [],
  },
  {
    _id: 'demo-3',
    title: 'Temple Street Study',
    category: 'Commission',
    description: 'A warm street-scape commission with hand-finished details.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'],
    stock: 2,
    artist: 'Shona Studio',
    style: 'Realism',
    popularity: 88,
    featured: false,
    reviews: [],
    bids: [],
  },
];

const initialState: ArtworkState = { items: demoArtworks, loading: false };

const artworkSlice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.length ? action.payload : demoArtworks;
      })
      .addCase(fetchArtwork.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export default artworkSlice.reducer;
