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
import { DeepPartial } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, recruiterId: number): Promise<Job> {
    const { location_id, ...restDto } = createJobDto
    const newJob = this.jobRepository.create({
    ...restDto,
    postedBy: { id: recruiterId },
    location: location_id ? ({ id: location_id } as DeepPartial<any>) : undefined,
} as DeepPartial<Job>);
    return this.jobRepository.save(newJob);
  }

  findAll(city?: string, keyword?: string): Promise<Job[]> {
    const qb = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('job.location', 'location');

    if (keyword && keyword.trim()) {
      qb.andWhere('LOWER(job.title) LIKE :kw OR LOWER(job.description) LIKE :kw', {
        kw: `%${keyword.toLowerCase()}%`,
      });
    }

    if (city && city.trim() && city !== 'All') {
      qb.andWhere('LOWER(location.name) = :city OR LOWER(location.city) = :city', {
        city: city.toLowerCase(),
      });
    }

    return qb.getMany();
  }


  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['postedBy', 'location'],
    });
    if (!job) {
      throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto, recruiterId: number): Promise<Job> {
    const job = await this.findOne(id);

    if (job.postedBy.id !== recruiterId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa công việc này.');
    }

    const { location_id, ...restDto } = updateJobDto;

    Object.assign(job, restDto);
    if (location_id) job.location = { id: location_id } as any;
    return this.jobRepository.save(job);
  }

  async remove(id: number, recruiterId: number): Promise<void> {
    const job = await this.findOne(id);
    if (job.postedBy.id !== recruiterId) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này.');
    }
    await this.jobRepository.remove(job);
  }
}