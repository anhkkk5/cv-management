import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../shared/schemas/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createDto: CreateSkillDto, userId: number): Promise<Skill> {
    const entity = this.skillRepository.create({
      ...createDto,
      user: { id: userId } as any,
    });
    return this.skillRepository.save(entity);
  }

  findAllForUser(userId: number): Promise<Skill[]> {
    return this.skillRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Skill> {
    const item = await this.skillRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy kỹ năng');
    }

    if (item.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem mục này');
    }

    return item;
  }

  async update(id: number, updateDto: UpdateSkillDto, userId: number): Promise<Skill> {
    const item = await this.findOne(id, userId);
    Object.assign(item, updateDto);
    return this.skillRepository.save(item);
  }

  async remove(id: number, userId: number): Promise<void> {
    const item = await this.findOne(id, userId);
    await this.skillRepository.remove(item);
  }
}