// src/jobs/jobs.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from '../shared/schemas/job.entity';
import { FilterJobDto } from './dto/filter-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, recruiterId: number): Promise<Job> {
    const { locationId, companyId, ...restDto } = createJobDto;

    const newJob = this.jobRepository.create({
      ...restDto,
      postedBy: { id: recruiterId },      
      location: (locationId ? { id: locationId } : null) as any,
      company: (companyId ? { id: companyId } : null) as any,
    });

    return this.jobRepository.save(newJob);
  }

  findAll(filterDto: FilterJobDto): Promise<Job[]> {
    const { location: city, search: keyword, category } = filterDto; // Destructuring để lấy dữ liệu

    const qb = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('job.location', 'location')
      .leftJoinAndSelect('job.company', 'company');

    // 1. Tìm theo từ khóa (title hoặc description)
    if (keyword && keyword.trim()) {
      qb.andWhere(
        '(LOWER(job.title) LIKE :kw OR LOWER(job.description) LIKE :kw)',
        { kw: `%${keyword.toLowerCase()}%` },
      );
    }

    // 2. Tìm theo thành phố (Location)
    if (city && city.trim() && city !== 'All') {
      qb.andWhere('LOWER(location.name) = :city', {
        city: city.toLowerCase(),
      });
    }

    // 3. Tìm theo ngành nghề (Category) - Mới thêm
    if (category) {
      qb.andWhere('job.jobCategory = :category', { category });
    }

    qb.orderBy('job.created_at', 'DESC');

    return qb.getMany();
  }

  /**
   * Lấy chi tiết 1 công việc
   */
  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['postedBy', 'location', 'company'], // Lấy thêm company
    });
    if (!job) {
      throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
    }
    return job;
  }

  /**
   * Cập nhật công việc
   */
  async update(
    id: number,
    updateJobDto: UpdateJobDto,
    recruiterId: number,
    isAdmin = false,
  ): Promise<Job> {
    const job = await this.findOne(id);

    if (!isAdmin && job.postedBy.id !== recruiterId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa công việc này.');
    }

    // Tách ID quan hệ
    const { locationId, companyId, ...restDto } = updateJobDto;

    // Cập nhật thông tin thường
    Object.assign(job, restDto);

    // SỬA LỖI: Dùng 'as any' để tránh lỗi gán null vào kiểu Location
    if (locationId !== undefined) {
      job.location = (locationId ? { id: locationId } : null) as any;
    }

    // SỬA LỖI: Tương tự với Company
    if (companyId !== undefined) {
      job.company = (companyId ? { id: companyId } : null) as any;
    }

    return this.jobRepository.save(job);
  }

  /**
   * Xóa công việc
   */
  async remove(id: number, recruiterId: number, isAdmin = false): Promise<void> {
    const job = await this.findOne(id);
    
    if (!isAdmin && job.postedBy.id !== recruiterId) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này.');
    }
    
    await this.jobRepository.remove(job);
  }
}