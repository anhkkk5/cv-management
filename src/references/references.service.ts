import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../shared/schemas/reference.entity';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
  ) {}

  async create(
    createDto: CreateReferenceDto,
    userId: number,
  ): Promise<Reference> {
    const entity = this.referenceRepository.create({
      ...createDto,
      user: { id: userId } as any,
    });
    return this.referenceRepository.save(entity);
  }

  findAllForUser(userId: number): Promise<Reference[]> {
    return this.referenceRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Reference> {
    const reference = await this.referenceRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reference) {
      throw new NotFoundException('Không tìm thấy người giới thiệu');
    }

    if (reference.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem mục này');
    }

    return reference;
  }

  async update(
    id: number,
    updateDto: UpdateReferenceDto,
    userId: number,
  ): Promise<Reference> {
    const reference = await this.findOne(id, userId);
    Object.assign(reference, updateDto);
    return this.referenceRepository.save(reference);
  }

  async remove(id: number, userId: number): Promise<void> {
    const reference = await this.findOne(id, userId);
    await this.referenceRepository.remove(reference);
  }
}
