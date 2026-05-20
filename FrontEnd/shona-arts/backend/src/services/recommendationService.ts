import { Painting } from '../models/Painting.js';

export async function recommendArtworks(artworkId?: string, style?: string) {
  const filter: Record<string, unknown> = {};
  if (artworkId) filter._id = { $ne: artworkId };
  if (style) filter.style = style;
  return Painting.find(filter).sort('-featured -popularity').limit(8);
}
