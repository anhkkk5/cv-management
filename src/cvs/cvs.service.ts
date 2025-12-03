import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from '../shared/schemas/cv.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvsService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  private async getCandidateByUserId(userId: number): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    if (!candidate) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng viên của bạn');
    }
    return candidate;
  }

  async findMyCvs(userId: number): Promise<Cv[]> {
    const candidate = await this.getCandidateByUserId(userId);
    return this.cvRepository.find({
      where: { candidate: { id: candidate.id } },
      order: { created_at: 'DESC' },
    });
  }

  async findOneForOwner(userId: number, id: number): Promise<Cv> {
    const candidate = await this.getCandidateByUserId(userId);
    const cv = await this.cvRepository.findOne({
      where: { id, candidate: { id: candidate.id } },
    });
    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV');
    }
    return cv;
  }

  async create(userId: number, dto: CreateCvDto): Promise<Cv> {
    const candidate = await this.getCandidateByUserId(userId);

    const cv = this.cvRepository.create({
      ...dto,
      candidate,
    });

    if (dto.isDefault) {
      await this.cvRepository.update({ candidate: { id: candidate.id } }, { isDefault: false });
    }

    return this.cvRepository.save(cv);
  }

  async update(userId: number, id: number, dto: UpdateCvDto): Promise<Cv> {
    const candidate = await this.getCandidateByUserId(userId);
    const cv = await this.cvRepository.findOne({ where: { id }, relations: { candidate: true } });
    if (!cv || cv.candidate.id !== candidate.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa CV này');
    }

    Object.assign(cv, dto);

    if (dto.isDefault) {
      await this.cvRepository.update({ candidate: { id: candidate.id } }, { isDefault: false });
      cv.isDefault = true;
    }

    return this.cvRepository.save(cv);
  }

  async remove(userId: number, id: number): Promise<void> {
    const candidate = await this.getCandidateByUserId(userId);
    const cv = await this.cvRepository.findOne({ where: { id }, relations: { candidate: true } });
    if (!cv || cv.candidate.id !== candidate.id) {
      throw new ForbiddenException('Bạn không có quyền xóa CV này');
    }
    await this.cvRepository.remove(cv);
  }

  // Recruiter/Admin xem chi tiết 1 CV bất kỳ theo id (không cần là owner)
  async findPublicById(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({ where: { id }, relations: { candidate: { user: true } } });
    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV');
    }
    return cv;
  }
}
