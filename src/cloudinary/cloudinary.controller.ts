// src/cloudinary/cloudinary.controller.ts
import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { memoryStorage } from 'multer';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Cloudinary (Upload Utility)')
@ApiBearerAuth()
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // 1. Upload đơn
  @Public()
  @Post('upload')
  @ApiOperation({ summary: 'Upload single image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'avatars' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.cloudinaryService.uploadImage(file, folder);
  }

  // 2. Upload đa hình ảnh
  @Public()
  @Post('upload-multiple')
  @ApiOperation({ summary: 'Upload multiple images (Max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        folder: { type: 'string', example: 'products' },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    return this.cloudinaryService.uploadMultipleImages(files, folder);
  }

  // 3. Xóa ảnh
  @Public()
  @Delete('delete')
  @ApiOperation({ summary: 'Delete image by Public ID' })
  @ApiBody({
      schema: {
          type: 'object',
          properties: { publicId: { type: 'string', example: 'avatars/abc123xyz' } }
      }
  })
  async deleteImage(@Body('publicId') publicId: string) {
    return this.cloudinaryService.deleteImage(publicId);
  }
}