import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from '../shared/schemas/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
  ) {}

  async create(createDto: CreateAwardDto, userId: number): Promise<Award> {
    const entity = this.awardRepository.create({
      ...createDto,
      user: { id: userId } as any,
    });
    return this.awardRepository.save(entity);
  }

  findAllForUser(userId: number): Promise<Award[]> {
    return this.awardRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Award> {
    const award = await this.awardRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!award) {
      throw new NotFoundException('Không tìm thấy danh hiệu/giải thưởng');
    }

    if (award.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem mục này');
    }

    return award;
  }

  async update(id: number, updateDto: UpdateAwardDto, userId: number): Promise<Award> {
    const award = await this.findOne(id, userId);
    Object.assign(award, updateDto);
    return this.awardRepository.save(award);
  }

  async remove(id: number, userId: number): Promise<void> {
    const award = await this.findOne(id, userId);
    await this.awardRepository.remove(award);
  }
}
