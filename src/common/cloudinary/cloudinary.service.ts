import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: any,
  ) { }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder, 
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      ).end(file.buffer);
    });
  }
}
