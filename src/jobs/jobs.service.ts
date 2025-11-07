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
    const { location, ...restDto } = createJobDto
    const newJob = this.jobRepository.create({
    ...restDto,
    postedBy: { id: recruiterId },
    location: location ? ({ id: location } as DeepPartial<any>) : undefined,
} as DeepPartial<Job>);
    return this.jobRepository.save(newJob);
  }

  findAll(): Promise<Job[]> {
    return this.jobRepository.find({ relations: ['postedBy', 'location'] });
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

    const { location, ...restDto } = updateJobDto;

    Object.assign(job, restDto);
    if (location) job.location = { id: location } as any;
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