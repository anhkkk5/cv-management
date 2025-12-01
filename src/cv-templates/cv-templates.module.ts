import { Module } from '@nestjs/common';
import { CvTemplatesService } from './cv-templates.service';
import { CvTemplatesController } from './cv-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvTemplate } from '../shared/schemas/cv-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CvTemplate])],
  controllers: [CvTemplatesController],
  providers: [CvTemplatesService],
})
export class CvTemplatesModule {}
