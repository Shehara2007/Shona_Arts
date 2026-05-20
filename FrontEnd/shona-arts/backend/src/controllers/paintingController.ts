import type { Request, Response } from 'express';
import { Painting } from '../models/Painting.js';
import { recommendArtworks } from '../services/recommendationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { PaginationQuery } from '../types/api.js';

export const getPaintings = asyncHandler(async (req: Request, res: Response) => {
  const { category, style, search, sort = '-popularity', page = '1', limit = '12', minPrice, maxPrice } = req.query as PaginationQuery;
  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (style) filter.style = style;
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  }
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const [paintings, total] = await Promise.all([
    Painting.find(filter).populate('reviews').sort(String(sort)).skip((currentPage - 1) * pageSize).limit(pageSize),
    Painting.countDocuments(filter),
  ]);
  res.json({ data: paintings, pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
});

export const getPainting = asyncHandler(async (req: Request, res: Response) => {
  const painting = await Painting.findById(req.params.id).populate('reviews');
  if (!painting) return res.status(404).json({ message: 'Painting not found' });
  res.json(painting);
});

export const createPainting = asyncHandler(async (req: Request, res: Response) => {
  const painting = await Painting.create(req.body);
  res.status(201).json(painting);
});

export const updatePainting = asyncHandler(async (req: Request, res: Response) => {
  const painting = await Painting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(painting);
});

export const deletePainting = asyncHandler(async (req: Request, res: Response) => {
  await Painting.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const paintings = await recommendArtworks(req.query.artworkId as string | undefined, req.query.style as string | undefined);
  res.json(paintings);
});
