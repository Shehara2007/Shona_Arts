import type { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'shona-arts' }, (error, uploadResult) => {
      if (error || !uploadResult) return reject(error);
      resolve(uploadResult as { secure_url: string });
    });
    stream.end(req.file?.buffer);
  });
  res.status(201).json({ url: result.secure_url });
});
