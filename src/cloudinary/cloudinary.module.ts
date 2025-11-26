// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [CloudinaryController],
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}