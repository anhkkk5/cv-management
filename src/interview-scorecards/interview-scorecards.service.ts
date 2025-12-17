import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewScorecard } from '../shared/schemas/interview-scorecard.entity';
import { InterviewSchedule } from '../shared/schemas/interview-schedule.entity';
import { User } from '../shared/schemas/user.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { Company } from '../shared/schemas/company.entity';
import { UpsertInterviewScorecardDto } from './dto/upsert-interview-scorecard.dto';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InterviewScorecardsService {
  constructor(
    @InjectRepository(InterviewScorecard)
    private readonly scoreRepo: Repository<InterviewScorecard>,
    @InjectRepository(InterviewSchedule)
    private readonly scheduleRepo: Repository<InterviewSchedule>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async getCompanyByRecruiterUserId(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['company'] });
    if (!user?.company) throw new ForbiddenException('Tài khoản này chưa gắn với công ty.');
    return user.company;
  }

  async upsert(scheduleId: number, dto: UpsertInterviewScorecardDto, recruiterUserId: number, isAdmin = false) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: scheduleId },
      relations: ['company', 'company.user', 'candidate', 'candidate.user', 'job'],
    });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch phỏng vấn');

    if (!isAdmin) {
      const company = await this.getCompanyByRecruiterUserId(recruiterUserId);
      if (schedule.company?.id !== company.id) {
        throw new ForbiddenException('Bạn không có quyền chấm điểm lịch này');
      }
    }

    if (dto.decision === 'next_round' && !dto.nextRound) {
      throw new BadRequestException('Vui lòng nhập nextRound khi quyết định là next_round');
    }

    let scorecard = await this.scoreRepo.findOne({
      where: { schedule: { id: scheduleId } },
      relations: ['schedule'],
    });

    if (!scorecard) {
      scorecard = this.scoreRepo.create({
        schedule: { id: scheduleId } as any,
        createdBy: { id: recruiterUserId } as any,
        decision: dto.decision,
      });
    }

    scorecard.technicalScore = dto.technicalScore;
    scorecard.communicationScore = dto.communicationScore;
    scorecard.cultureFitScore = dto.cultureFitScore;
    scorecard.strengths = dto.strengths;
    scorecard.weaknesses = dto.weaknesses;
    scorecard.notes = dto.notes;
    scorecard.decision = dto.decision;
    scorecard.nextRound = dto.nextRound;

    const saved = await this.scoreRepo.save(scorecard);

    const candidateUserId = schedule.candidate?.user?.id;
    const candidateEmail = schedule.candidate?.email || schedule.candidate?.user?.email;
    const companyName = schedule.company?.companyName || schedule.company?.fullName || 'Công ty';
    const jobTitle = schedule.job?.title || '';

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = '/interviews';
    const fullLink = `${frontendUrl}${link}`;

    const decisionLabel =
      dto.decision === 'pass'
        ? 'Đạt'
        : dto.decision === 'fail'
          ? 'Không đạt'
          : `Qua vòng ${dto.nextRound}`;

    if (candidateUserId) {
      await this.notificationsService.create({
        userId: candidateUserId,
        type: 'interview_result',
        title: 'Kết quả phỏng vấn',
        message: `${companyName} - ${jobTitle}: ${decisionLabel}`,
        link,
      });
    }

    if (candidateEmail) {
      await this.mailService.sendMail({
        to: candidateEmail,
        subject: `Kết quả phỏng vấn - ${jobTitle}`,
        html: `<p>Chào ${schedule.candidate?.fullName || 'bạn'},</p>
<p><b>${companyName}</b> đã cập nhật kết quả phỏng vấn cho vị trí <b>${jobTitle}</b>.</p>
<p><b>Kết quả:</b> ${decisionLabel}</p>
<p>Bạn có thể xem chi tiết trên hệ thống: <a href="${fullLink}">${fullLink}</a></p>`,
      });
    }

    return this.scoreRepo.findOne({
      where: { id: saved.id },
      relations: ['schedule', 'schedule.job', 'schedule.company', 'schedule.candidate'],
    });
  }

  async listMy(candidateUserId: number) {
    const candidate = await this.candidateRepo.findOne({ where: { user: { id: candidateUserId } } });
    if (!candidate) throw new BadRequestException('Bạn chưa có hồ sơ ứng viên');

    return this.scoreRepo.find({
      where: { schedule: { candidate: { id: candidate.id } } },
      relations: ['schedule', 'schedule.job', 'schedule.company'],
      order: { created_at: 'DESC' },
    });
  }

  async getBySchedule(scheduleId: number, recruiterUserId: number, isAdmin = false) {
    const schedule = await this.scheduleRepo.findOne({ where: { id: scheduleId }, relations: ['company'] });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch phỏng vấn');

    if (!isAdmin) {
      const company = await this.getCompanyByRecruiterUserId(recruiterUserId);
      if (schedule.company?.id !== company.id) {
        throw new ForbiddenException('Bạn không có quyền xem scorecard này');
      }
    }

    return this.scoreRepo.findOne({
      where: { schedule: { id: scheduleId } },
      relations: ['schedule', 'schedule.job', 'schedule.company', 'schedule.candidate'],
    });
  }
}
