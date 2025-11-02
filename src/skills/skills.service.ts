import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from '../shared/schemas/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  create(createDto: CreateSkillDto, userId: number): Promise<Skill> {
    const newSkill = this.skillRepository.create({ ...createDto, user: { id: userId } });
    return this.skillRepository.save(newSkill);
  }

  findAllForUser(userId: number): Promise<Skill[]> {
    return this.skillRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id }, relations: ['user'] });
    if (!skill) {
      throw new NotFoundException(`Không tìm thấy kỹ năng với ID ${id}`);
    }
    if (skill.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }
    return skill;
  }

  async update(id: number, updateDto: UpdateSkillDto, userId: number): Promise<Skill> {
    const skill = await this.findOne(id, userId);
    Object.assign(skill, updateDto);
    return this.skillRepository.save(skill);
  }

  async remove(id: number, userId: number): Promise<void> {
    const skill = await this.findOne(id, userId);
    await this.skillRepository.remove(skill);
  }
}