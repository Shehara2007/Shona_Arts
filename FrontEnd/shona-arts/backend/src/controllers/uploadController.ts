import crypto from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const hasCloudinaryCredentials = () => {
  const values = [process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET];
  return values.every((value) => value && !value.startsWith('your-'));
};

const localUploadUrl = (req: Request, filename: string) => {
  const baseUrl = process.env.API_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads-local/${filename}`;
};

const saveLocalImage = async (req: Request) => {
  if (!req.file) throw new Error('Image is required');
  const extension = path.extname(req.file.originalname) || '.jpg';
  const filename = `${crypto.randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), req.file.buffer);
  return localUploadUrl(req, filename);
};

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  if (!hasCloudinaryCredentials()) {
    res.status(201).json({ url: await saveLocalImage(req) });
    return;
  }

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'shona-arts' }, (error: any, uploadResult: any) => {
        if (error || !uploadResult) return reject(error);
        resolve(uploadResult as { secure_url: string });
      });
      stream.end(req.file?.buffer);
    });
    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    console.warn('Cloudinary upload failed, saved image locally instead:', error);
    res.status(201).json({ url: await saveLocalImage(req) });
  }
});
