import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Education } from '@shared/schemas/education.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly eduRepository: Repository<Education>,
  ) {}

  create(createDto: CreateEducationDto, userId: number): Promise<Education> {
    const newEdu = this.eduRepository.create({ ...createDto, user: { id: userId } });
    return this.eduRepository.save(newEdu);
  }

  findAllForUser(userId: number): Promise<Education[]> {
    return this.eduRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Education> {
    const edu = await this.eduRepository.findOne({ where: { id }, relations: ['user'] });
    if (!edu) {
      throw new NotFoundException(`Không tìm thấy học vấn với ID ${id}`);
    }
    if (edu.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }
    return edu;
  }

  async update(id: number, updateDto: UpdateEducationDto, userId: number): Promise<Education> {
    const edu = await this.findOne(id, userId); // findOne đã kiểm tra quyền
    Object.assign(edu, updateDto);
    return this.eduRepository.save(edu);
  }

  async remove(id: number, userId: number): Promise<void> {
    const edu = await this.findOne(id, userId);
    await this.eduRepository.remove(edu);
  }
}