import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../shared/schemas/application.entity';
import { Job } from '../shared/schemas/job.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Role } from '../common/enums/role.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    userId: number,
    cvPdfFile?: Express.Multer.File,
  ): Promise<Application> {
    // Tìm job
    const job = await this.jobRepository.findOne({ where: { id: createApplicationDto.jobId } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Tìm candidate profile của user
    const candidate = await this.candidateRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!candidate) {
      throw new NotFoundException('Bạn cần tạo hồ sơ ứng viên trước khi ứng tuyển');
    }

    // Kiểm tra xem đã ứng tuyển chưa
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        job: { id: job.id },
        candidate: { id: candidate.id },
      },
    });

    if (existingApplication) {
      throw new ConflictException('Bạn đã ứng tuyển công việc này rồi');
    }

    // Upload PDF CV lên Cloudinary nếu có
    let cvPdfUrl: string | null = null;
    if (cvPdfFile) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(
          cvPdfFile,
          'cv_pdfs',
        );
        cvPdfUrl = uploadResult.secure_url;
      } catch (error) {
        throw new BadRequestException('Không thể upload file PDF CV');
      }
    }

    // Tạo application mới
    const application = this.applicationRepository.create({
      job,
      candidate,
      status: 'pending',
      cvPdfUrl: cvPdfUrl || null,
    });

    return this.applicationRepository.save(application);
  }

  async findMyApplications(userId: number): Promise<Application[]> {
    const candidate = await this.candidateRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!candidate) {
      return [];
    }

    return this.applicationRepository.find({
      where: { candidate: { id: candidate.id } },
      relations: ['job', 'job.postedBy', 'job.location', 'candidate', 'candidate.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByJobId(jobId: number, userId: number, userRole?: Role): Promise<Application[]> {
    // Kiểm tra job có tồn tại không
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['postedBy'],
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Kiểm tra quyền: chỉ recruiter/company của job hoặc admin mới được xem
    const isAdmin = userRole === Role.Admin;
    if (!isAdmin && job.postedBy.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem danh sách ứng viên của công việc này');
    }

    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['candidate', 'candidate.user', 'job'],
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(
    applicationId: number,
    updateStatusDto: UpdateApplicationStatusDto,
    userId: number,
    userRole?: Role,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job', 'job.postedBy'],
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    // Kiểm tra quyền: chỉ recruiter/company của job hoặc admin mới được cập nhật
    const isAdmin = userRole === Role.Admin;
    if (!isAdmin && application.job.postedBy.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật trạng thái đơn ứng tuyển này');
    }

    application.status = updateStatusDto.status;
    return this.applicationRepository.save(application);
  }
}

