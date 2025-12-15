// src/cloudinary/cloudinary.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  
  // 1. Upload 1 ảnh
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'cv_management_uploads',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new BadRequestException('Upload failed: no result returned from Cloudinary'));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // Upload file PDF (hoặc file khác) với resource_type = 'raw'
  async uploadPdf(
    file: Express.Multer.File,
    folder: string = 'cv_pdfs',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new BadRequestException(
                'Upload failed: no result returned from Cloudinary',
              ),
            );
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // 2. Upload nhiều ảnh (Dùng Promise.all để chạy song song)
  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'cv_management_uploads',
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    // Ép kiểu kết quả về mảng UploadApiResponse
    return Promise.all(uploadPromises) as Promise<UploadApiResponse[]>;
  }

  // 3. Xóa ảnh
  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // 4. Upload từ URL (Optional)
  async uploadFromUrl(url: string, folder: string = 'cv_management_uploads'): Promise<UploadApiResponse> {
     return cloudinary.uploader.upload(url, { folder });
  }
}