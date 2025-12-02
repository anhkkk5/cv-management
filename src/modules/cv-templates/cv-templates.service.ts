import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvTemplate } from '@shared/schemas/cv-template.entity';
import { CreateCvTemplateDto } from './dto/create-cv-template.dto';
import { UpdateCvTemplateDto } from './dto/update-cv-template.dto';

@Injectable()
export class CvTemplatesService {
  constructor(
    @InjectRepository(CvTemplate)
    private readonly templateRepo: Repository<CvTemplate>,
  ) {}

  create(createDto: CreateCvTemplateDto) {
    const template = this.templateRepo.create(createDto);
    return this.templateRepo.save(template);
  }

  findAll() {
    return this.templateRepo.find({ where: { isActive: true } });
  }

  async findOne(id: number) {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async update(id: number, updateDto: UpdateCvTemplateDto) {
    const template = await this.findOne(id);
    Object.assign(template, updateDto);
    return this.templateRepo.save(template);
  }

  async remove(id: number) {
    const template = await this.findOne(id);
    return this.templateRepo.remove(template); // Hoặc soft delete: template.isActive = false
  }
}