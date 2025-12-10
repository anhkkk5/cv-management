import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CV } from '../shared/schemas/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvsService {
  constructor(
    @InjectRepository(CV)
    private readonly cvRepository: Repository<CV>,
  ) {}

  async create(createCvDto: CreateCvDto, userId: number): Promise<CV> {
    // Nếu đặt CV này làm mặc định, bỏ mặc định của các CV khác
    if (createCvDto.isDefault) {
      await this.cvRepository.update(
        { user: { id: userId } },
        { isDefault: false },
      );
    }

    const newCV = this.cvRepository.create({
      ...createCvDto,
      user: { id: userId },
    });

    return this.cvRepository.save(newCV);
  }

  async findMyCVs(userId: number): Promise<CV[]> {
    return this.cvRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV');
    }

    // Kiểm tra quyền: chỉ owner hoặc admin mới được xem
    if (cv.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem CV này');
    }

    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto, userId: number): Promise<CV> {
    const cv = await this.findOne(id, userId);

    // Nếu đặt CV này làm mặc định, bỏ mặc định của các CV khác
    if (updateCvDto.isDefault) {
      await this.cvRepository
        .createQueryBuilder()
        .update(CV)
        .set({ isDefault: false })
        .where('user.id = :userId AND id != :cvId', { userId, cvId: id })
        .execute();
    }

    Object.assign(cv, updateCvDto);
    return this.cvRepository.save(cv);
  }

  async remove(id: number, userId: number): Promise<void> {
    const cv = await this.findOne(id, userId);
    await this.cvRepository.remove(cv);
  }

  // Tìm kiếm CV cho recruiter/admin
  async searchAllCVs(): Promise<CV[]> {
    return this.cvRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}

