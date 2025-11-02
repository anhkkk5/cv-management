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

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, recruiterId: number): Promise<Job> {
    const newJob = this.jobRepository.create({
      ...createJobDto,
      postedBy: { id: recruiterId },
    });
    return this.jobRepository.save(newJob);
  }

  findAll(): Promise<Job[]> {
    return this.jobRepository.find({ relations: ['postedBy'] });
  }


  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['postedBy'],
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

    Object.assign(job, updateJobDto);
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