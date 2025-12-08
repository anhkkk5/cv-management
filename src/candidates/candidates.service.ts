import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../shared/schemas/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async findMyProfile(userId: number): Promise<Candidate> {
    const profile = await this.candidateRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException('Không tìm thấy hồ sơ của bạn.');
    }
    return profile;
  }

  async createMyProfile(userId: number, createDto: CreateCandidateDto): Promise<Candidate> {
    const existingProfile = await this.candidateRepository.findOne({ where: { user: { id: userId } } });
    if (existingProfile) {
      throw new ConflictException('Bạn đã có hồ sơ rồi. Hãy dùng API cập nhật (PATCH).');
    }
    
    const newProfile = this.candidateRepository.create({
      ...createDto,
      user: { id: userId },
    });
    return this.candidateRepository.save(newProfile);
  }

  async updateMyProfile(userId: number, updateDto: UpdateCandidateDto): Promise<Candidate> {
    const profile = await this.findMyProfile(userId); // Dùng lại hàm findMyProfile để kiểm tra
    Object.assign(profile, updateDto);
    return this.candidateRepository.save(profile);
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find({
      relations: { user: true },
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<Candidate> {
    const profile = await this.candidateRepository.findOne({ where: { id }, relations: { user: true } });
    if (!profile) throw new NotFoundException('Candidate not found');
    return profile;
  }

  // Admin update candidate directly by id
  async updateByAdmin(id: number, updateDto: UpdateCandidateDto): Promise<Candidate> {
    const profile = await this.findById(id);
    Object.assign(profile, updateDto);
    return this.candidateRepository.save(profile);
  }

  // Admin delete candidate by id
  async remove(id: number): Promise<void> {
    const profile = await this.findById(id);
    await this.candidateRepository.remove(profile);
  }
}