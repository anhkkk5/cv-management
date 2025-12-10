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
    // Explicitly strip any "location" field coming from the client so it
    // does not bind to the Location relation and generate a wrong locationId.
    const { location_id, /* eslint-disable-line @typescript-eslint/no-unused-vars */
      // @ts-ignore - location may exist on incoming payload
      location,
      ...restDto } = createJobDto as any;

    const newJob = this.jobRepository.create({
      ...restDto,
      location_id,
      postedBy: { id: recruiterId },
      // make sure relation is unset
      location: null,
    } as DeepPartial<Job>);

    return this.jobRepository.save(newJob);
  }

  findAll(city?: string, keyword?: string, position?: string): Promise<Job[]> {
    const qb = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('job.location', 'location');

    if (keyword && keyword.trim()) {
      qb.andWhere('LOWER(job.title) LIKE :kw OR LOWER(job.description) LIKE :kw', {
        kw: `%${keyword.toLowerCase()}%`,
      });
    }

    if (position && position.trim()) {
      qb.andWhere('LOWER(job.title) LIKE :pos', {
        pos: `%${position.toLowerCase()}%`,
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

    // Strip any free-text 'location' field so it does not bind to the
    // Location relation and corrupt the numeric locationId column.
    const {
      location_id,
      // @ts-ignore - location may exist on incoming payload
      location,
      ...restDto
    } = updateJobDto as any;

    Object.assign(job, restDto);
    if (typeof location_id !== 'undefined') {
      job.location_id = location_id;
    }
    // Ensure relation is not updated using free-text value
    job.location = job.location; // keep existing relation (usually null)
    return this.jobRepository.save(job);
  }

  async remove(id: number, recruiterId: number, isAdmin = false): Promise<void> {
    const job = await this.findOne(id);
    if (!isAdmin && job.postedBy.id !== recruiterId) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này.');
    }
    await this.jobRepository.remove(job);
  }
}