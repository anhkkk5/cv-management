import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../shared/schemas/application.entity';
import { Job } from '../shared/schemas/job.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
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

  async create(createDto: CreateApplicationDto, userId: number): Promise<Application> {
    const candidate = await this.getCandidateByUserId(userId);
    const job = await this.jobRepository.findOne({ where: { id: createDto.jobId } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    const existing = await this.applicationRepository.findOne({
      where: { candidate: { id: candidate.id }, job: { id: job.id } },
    });
    if (existing) {
      throw new BadRequestException('Bạn đã ứng tuyển công việc này rồi');
    }

    const app = this.applicationRepository.create({
      candidate,
      job,
      status: 'pending',
    });
    return this.applicationRepository.save(app);
  }

  async findMyApplications(userId: number): Promise<Application[]> {
    const candidate = await this.getCandidateByUserId(userId);
    return this.applicationRepository.find({
      where: { candidate: { id: candidate.id } },
      relations: { job: true, candidate: { user: true } },
      order: { created_at: 'DESC' },
    });
  }

  async findByJob(jobId: number): Promise<Application[]> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: { candidate: { user: true }, job: true },
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(
    id: number,
    status: string,
    recruiterId: number,
    isAdmin: boolean,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: { job: { postedBy: true }, candidate: { user: true } },
    });
    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    if (!isAdmin && application.job.postedBy.id !== recruiterId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật đơn ứng tuyển này');
    }

    application.status = status;
    return this.applicationRepository.save(application);
  }
}
