import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto, userId: number): Promise<Experience> {
    const newExperience = this.experienceRepository.create({
      ...createExperienceDto,
      user: { id: userId }, 
    });
    return this.experienceRepository.save(newExperience);
  }

  findAllForUser(userId: number): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Experience> {
    const experience = await this.experienceRepository.findOne({ where: { id }, relations: ['user'] });
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    if (experience.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
    return experience;
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto, userId: number): Promise<Experience> {
    const experience = await this.findOne(id, userId); 
    Object.assign(experience, updateExperienceDto);
    return this.experienceRepository.save(experience);
  }

  async remove(id: number, userId: number): Promise<void> {
    const experience = await this.findOne(id, userId);
    await this.experienceRepository.remove(experience);
  }
}