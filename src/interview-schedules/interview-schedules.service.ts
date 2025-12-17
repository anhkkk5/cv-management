import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewSchedule } from '../shared/schemas/interview-schedule.entity';
import { Application } from '../shared/schemas/application.entity';
import { User } from '../shared/schemas/user.entity';
import { Company } from '../shared/schemas/company.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { Job } from '../shared/schemas/job.entity';
import { CreateInterviewScheduleDto } from './dto/create-interview-schedule.dto';
import { ConfirmInterviewDto } from './dto/confirm-interview.dto';
import { RequestRescheduleDto } from './dto/request-reschedule.dto';
import { RescheduleInterviewDto } from './dto/reschedule-interview.dto';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InterviewSchedulesService {
  constructor(
    @InjectRepository(InterviewSchedule)
    private readonly scheduleRepo: Repository<InterviewSchedule>,
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async getCompanyByRecruiterUserId(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });
    if (!user?.company) {
      throw new ForbiddenException('Tài khoản này chưa gắn với công ty.');
    }
    return user.company;
  }

  async listApprovedApplicationsForCompany(recruiterUserId: number, isAdmin = false) {
    if (isAdmin) {
      return this.applicationRepo.find({
        where: { status: 'approved' as any },
        relations: ['job', 'job.postedBy', 'candidate', 'candidate.user'],
        order: { created_at: 'DESC' },
      });
    }

    const company = await this.getCompanyByRecruiterUserId(recruiterUserId);

    const qb = this.applicationRepo
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('postedBy.company', 'company')
      .leftJoinAndSelect('app.candidate', 'candidate')
      .leftJoinAndSelect('candidate.user', 'candidateUser')
      .where('app.status = :st', { st: 'approved' })
      .andWhere('company.id = :companyId', { companyId: company.id })
      .orderBy('app.created_at', 'DESC');

    return qb.getMany();
  }

  async listCompanySchedules(recruiterUserId: number, isAdmin = false) {
    if (isAdmin) {
      return this.scheduleRepo.find({
        relations: [
          'application',
          'job',
          'candidate',
          'candidate.user',
          'company',
          'createdBy',
        ],
        order: { scheduledAt: 'DESC' },
      });
    }

    const company = await this.getCompanyByRecruiterUserId(recruiterUserId);
    return this.scheduleRepo.find({
      where: { company: { id: company.id } },
      relations: [
        'application',
        'job',
        'candidate',
        'candidate.user',
        'company',
        'createdBy',
      ],
      order: { scheduledAt: 'DESC' },
    });
  }

  async createSchedule(dto: CreateInterviewScheduleDto, recruiterUserId: number, isAdmin = false) {
    const scheduledAt = new Date(dto.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('scheduledAt không hợp lệ');
    }

    if (dto.mode === 'online' && !dto.meetingLink) {
      throw new BadRequestException('Vui lòng nhập link cuộc họp cho phỏng vấn Online');
    }
    if (dto.mode === 'offline' && !dto.address) {
      throw new BadRequestException('Vui lòng nhập địa chỉ cho phỏng vấn Offline');
    }

    const app = await this.applicationRepo.findOne({
      where: { id: dto.applicationId },
      relations: ['job', 'job.postedBy', 'job.postedBy.company', 'candidate', 'candidate.user'],
    });
    if (!app) throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    if (app.status !== 'approved') {
      throw new BadRequestException('Chỉ tạo lịch cho ứng viên đã được duyệt CV');
    }

    let company: Company | null = null;
    if (isAdmin) {
      company = app.job?.postedBy?.company || null;
    } else {
      company = await this.getCompanyByRecruiterUserId(recruiterUserId);
      if (!app.job?.postedBy?.company || app.job.postedBy.company.id !== company.id) {
        throw new ForbiddenException('Bạn không có quyền tạo lịch cho đơn ứng tuyển này');
      }
    }

    if (!company) {
      throw new BadRequestException('Không xác định được công ty');
    }

    const schedule = this.scheduleRepo.create({
      application: { id: app.id } as any,
      job: { id: app.job.id } as any,
      candidate: { id: app.candidate.id } as any,
      company: { id: company.id } as any,
      createdBy: { id: recruiterUserId } as any,
      round: dto.round,
      scheduledAt,
      mode: dto.mode,
      address: dto.address,
      meetingLink: dto.meetingLink,
      status: 'pending',
    });

    const saved = await this.scheduleRepo.save(schedule);

    const candidateEmail = app.candidate.email || app.candidate.user?.email;
    const candidateUserId = app.candidate.user?.id;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const actionLink = `${frontendUrl}/interviews`;

    if (candidateUserId) {
      await this.notificationsService.create({
        userId: candidateUserId,
        type: 'interview_schedule_created',
        title: 'Bạn có lịch phỏng vấn mới',
        message: `Vị trí: ${app.job.title} | Thời gian: ${scheduledAt.toLocaleString('vi-VN')}`,
        link: '/interviews',
      });
    }

    if (candidateEmail) {
      const location = dto.mode === 'offline' ? dto.address : 'Online';
      const ics = this.mailService.buildInterviewIcs({
        title: `Phỏng vấn - ${app.job.title} (Vòng ${dto.round})`,
        description: `Lịch phỏng vấn cho vị trí ${app.job.title}.\n\nXác nhận hoặc xin đổi lịch tại: ${actionLink}`,
        location,
        start: scheduledAt,
        durationMinutes: dto.durationMinutes,
        url: dto.mode === 'online' ? dto.meetingLink : undefined,
      });

      const detailLine =
        dto.mode === 'online'
          ? `Hình thức: Online\nLink: ${dto.meetingLink}`
          : `Hình thức: Offline\nĐịa chỉ: ${dto.address}`;

      await this.mailService.sendMail({
        to: candidateEmail,
        subject: `Lịch phỏng vấn - ${app.job.title} (Vòng ${dto.round})`,
        html: `<p>Chào ${app.candidate.fullName || 'bạn'},</p>
<p>Công ty đã tạo lịch phỏng vấn cho bạn.</p>
<p><b>Vị trí:</b> ${app.job.title}</p>
<p><b>Thời gian:</b> ${scheduledAt.toLocaleString('vi-VN')}</p>
<p><b>${detailLine.replace(/\n/g, '<br/>')}</b></p>
<p>Vui lòng vào hệ thống để <b>Xác nhận tham gia</b> hoặc <b>Xin đổi lịch</b>: <a href="${actionLink}">${actionLink}</a></p>`,
        ics,
      });
    }

    return this.scheduleRepo.findOne({
      where: { id: saved.id },
      relations: ['job', 'candidate', 'candidate.user', 'company', 'createdBy', 'application'],
    });
  }

  async listMySchedules(candidateUserId: number) {
    const candidate = await this.candidateRepo.findOne({
      where: { user: { id: candidateUserId } },
    });
    if (!candidate) {
      throw new BadRequestException('Bạn chưa có hồ sơ ứng viên');
    }

    return this.scheduleRepo.find({
      where: { candidate: { id: candidate.id } },
      relations: ['job', 'company', 'application'],
      order: { scheduledAt: 'DESC' },
    });
  }

  async confirm(id: number, dto: ConfirmInterviewDto, candidateUserId: number) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: ['candidate', 'candidate.user', 'company', 'company.user', 'job'],
    });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch phỏng vấn');
    if (schedule.candidate?.user?.id !== candidateUserId) {
      throw new ForbiddenException('Bạn không có quyền xác nhận lịch này');
    }

    schedule.status = 'confirmed';
    const saved = await this.scheduleRepo.save(schedule);

    const companyEmail = schedule.company?.email;
    const candidateEmail = schedule.candidate?.email || schedule.candidate?.user?.email;

    const companyUserId = schedule.company?.user?.id;
    if (companyUserId) {
      await this.notificationsService.create({
        userId: companyUserId,
        type: 'interview_confirmed',
        title: 'Ứng viên đã xác nhận lịch phỏng vấn',
        message: `${schedule.candidate?.fullName || 'Ứng viên'} đã xác nhận tham gia phỏng vấn cho ${schedule.job?.title}`,
        link: '/company/interviews',
      });
    }

    if (companyEmail) {
      await this.mailService.sendMail({
        to: companyEmail,
        subject: `Ứng viên xác nhận lịch phỏng vấn - ${schedule.job?.title}`,
        html: `<p>Ứng viên <b>${schedule.candidate?.fullName || ''}</b> đã xác nhận lịch phỏng vấn.</p>
<p><b>Vị trí:</b> ${schedule.job?.title || ''}</p>
<p><b>Thời gian:</b> ${new Date(schedule.scheduledAt).toLocaleString('vi-VN')}</p>
<p>Ghi chú ứng viên: ${dto?.note || '(không có)'} </p>`,
      });
    }

    if (candidateEmail) {
      await this.mailService.sendMail({
        to: candidateEmail,
        subject: `Bạn đã xác nhận lịch phỏng vấn - ${schedule.job?.title}`,
        html: `<p>Bạn đã xác nhận tham gia phỏng vấn.</p>
<p><b>Vị trí:</b> ${schedule.job?.title || ''}</p>
<p><b>Thời gian:</b> ${new Date(schedule.scheduledAt).toLocaleString('vi-VN')}</p>`,
      });
    }

    return saved;
  }

  async requestReschedule(id: number, dto: RequestRescheduleDto, candidateUserId: number) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: ['candidate', 'candidate.user', 'company', 'company.user', 'job'],
    });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch phỏng vấn');
    if (schedule.candidate?.user?.id !== candidateUserId) {
      throw new ForbiddenException('Bạn không có quyền xin đổi lịch này');
    }

    schedule.status = 'reschedule_requested';
    schedule.candidateRescheduleReason = dto.reason;
    const saved = await this.scheduleRepo.save(schedule);

    const companyEmail = schedule.company?.email;
    const candidateEmail = schedule.candidate?.email || schedule.candidate?.user?.email;

    const companyUserId = schedule.company?.user?.id;
    if (companyUserId) {
      await this.notificationsService.create({
        userId: companyUserId,
        type: 'interview_reschedule_requested',
        title: 'Ứng viên xin đổi lịch phỏng vấn',
        message: `${schedule.candidate?.fullName || 'Ứng viên'} xin đổi lịch phỏng vấn cho ${schedule.job?.title}. Lý do: ${dto.reason}`,
        link: '/company/interviews',
      });
    }

    if (companyEmail) {
      await this.mailService.sendMail({
        to: companyEmail,
        subject: `Ứng viên xin đổi lịch - ${schedule.job?.title}`,
        html: `<p>Ứng viên <b>${schedule.candidate?.fullName || ''}</b> xin đổi lịch phỏng vấn.</p>
<p><b>Vị trí:</b> ${schedule.job?.title || ''}</p>
<p><b>Lịch hiện tại:</b> ${new Date(schedule.scheduledAt).toLocaleString('vi-VN')}</p>
<p><b>Lý do:</b> ${dto.reason}</p>`,
      });
    }

    if (candidateEmail) {
      await this.mailService.sendMail({
        to: candidateEmail,
        subject: `Bạn đã gửi yêu cầu đổi lịch - ${schedule.job?.title}`,
        html: `<p>Bạn đã gửi yêu cầu đổi lịch phỏng vấn.</p>
<p><b>Vị trí:</b> ${schedule.job?.title || ''}</p>
<p><b>Lịch hiện tại:</b> ${new Date(schedule.scheduledAt).toLocaleString('vi-VN')}</p>
<p><b>Lý do:</b> ${dto.reason}</p>`,
      });
    }

    return saved;
  }

  async reschedule(id: number, dto: RescheduleInterviewDto, recruiterUserId: number, isAdmin = false) {
    const scheduledAt = new Date(dto.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('scheduledAt không hợp lệ');
    }

    if (dto.mode === 'online' && !dto.meetingLink) {
      throw new BadRequestException('Vui lòng nhập link cuộc họp cho phỏng vấn Online');
    }
    if (dto.mode === 'offline' && !dto.address) {
      throw new BadRequestException('Vui lòng nhập địa chỉ cho phỏng vấn Offline');
    }

    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: ['company', 'candidate', 'candidate.user', 'job', 'company.user'],
    });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch phỏng vấn');

    if (!isAdmin) {
      const company = await this.getCompanyByRecruiterUserId(recruiterUserId);
      if (schedule.company?.id !== company.id) {
        throw new ForbiddenException('Bạn không có quyền đổi lịch này');
      }
    }

    schedule.scheduledAt = scheduledAt;
    schedule.mode = dto.mode;
    schedule.address = dto.address;
    schedule.meetingLink = dto.meetingLink;
    schedule.status = 'rescheduled';
    schedule.companyRescheduleNote = dto.note;

    const saved = await this.scheduleRepo.save(schedule);

    const candidateEmail = schedule.candidate?.email || schedule.candidate?.user?.email;
    const candidateUserId = schedule.candidate?.user?.id;

    if (candidateUserId) {
      await this.notificationsService.create({
        userId: candidateUserId,
        type: 'interview_rescheduled',
        title: 'Lịch phỏng vấn đã được cập nhật',
        message: `Vị trí: ${schedule.job?.title} | Thời gian mới: ${scheduledAt.toLocaleString('vi-VN')}`,
        link: '/interviews',
      });
    }

    if (candidateEmail) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const actionLink = `${frontendUrl}/interviews`;
      const location = dto.mode === 'offline' ? dto.address : 'Online';
      const ics = this.mailService.buildInterviewIcs({
        title: `Phỏng vấn - ${schedule.job?.title} (Vòng ${schedule.round})`,
        description: `Lịch phỏng vấn đã được cập nhật.\n\nVui lòng vào hệ thống: ${actionLink}`,
        location,
        start: scheduledAt,
        durationMinutes: dto.durationMinutes,
        url: dto.mode === 'online' ? dto.meetingLink : undefined,
      });

      const detailLine =
        dto.mode === 'online'
          ? `Hình thức: Online\nLink: ${dto.meetingLink}`
          : `Hình thức: Offline\nĐịa chỉ: ${dto.address}`;

      await this.mailService.sendMail({
        to: candidateEmail,
        subject: `Cập nhật lịch phỏng vấn - ${schedule.job?.title}`,
        html: `<p>Lịch phỏng vấn của bạn đã được cập nhật.</p>
<p><b>Vị trí:</b> ${schedule.job?.title || ''}</p>
<p><b>Thời gian mới:</b> ${scheduledAt.toLocaleString('vi-VN')}</p>
<p><b>${detailLine.replace(/\n/g, '<br/>')}</b></p>
<p>Ghi chú từ công ty: ${dto.note || '(không có)'} </p>
<p>Vui lòng vào hệ thống để <b>Xác nhận</b> hoặc <b>Xin đổi lịch</b>: <a href="${actionLink}">${actionLink}</a></p>`,
        ics,
      });
    }

    return saved;
  }

  async remove(id: number, recruiterUserId: number, isAdmin = false) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch phỏng vấn');

    if (!isAdmin) {
      const company = await this.getCompanyByRecruiterUserId(recruiterUserId);
      if (schedule.company?.id !== company.id) {
        throw new ForbiddenException('Bạn không có quyền xoá lịch này');
      }
    }

    await this.scheduleRepo.delete(id);
    return { success: true };
  }
}
