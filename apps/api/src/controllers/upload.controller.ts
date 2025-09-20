import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { uploadService } from '../services/upload.service';

export const uploadController = {
  uploadImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const file = req.file;
      const userId = req.body.userId || 'anonymous';
      
      // Generate a unique filename
      const filename = `${userId}/${uuidv4()}-${file.originalname.replace(/\s/g, '_')}`;
      
      // Upload to storage (S3 or similar)
      const imageUrl = await uploadService.uploadToStorage(file.buffer, filename, file.mimetype);
      
      res.status(200).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  }
};
