import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hobby } from '../shared/schemas/hobby.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';

@Injectable()
export class HobbiesService {
  constructor(
    @InjectRepository(Hobby)
    private readonly hobbyRepository: Repository<Hobby>,
  ) {}

  async create(createDto: CreateHobbyDto, userId: number): Promise<Hobby> {
    const entity = this.hobbyRepository.create({
      ...createDto,
      user: { id: userId } as any,
    });
    return this.hobbyRepository.save(entity);
  }

  findAllForUser(userId: number): Promise<Hobby[]> {
    return this.hobbyRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Hobby> {
    const hobby = await this.hobbyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!hobby) {
      throw new NotFoundException('Không tìm thấy sở thích');
    }

    if (hobby.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem mục này');
    }

    return hobby;
  }

  async update(
    id: number,
    updateDto: UpdateHobbyDto,
    userId: number,
  ): Promise<Hobby> {
    const hobby = await this.findOne(id, userId);
    Object.assign(hobby, updateDto);
    return this.hobbyRepository.save(hobby);
  }

  async remove(id: number, userId: number): Promise<void> {
    const hobby = await this.findOne(id, userId);
    await this.hobbyRepository.remove(hobby);
  }
}


