import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSchedulesController } from './interview-schedules.controller';
import { InterviewSchedulesService } from './interview-schedules.service';
import { InterviewSchedule } from '../shared/schemas/interview-schedule.entity';
import { Application } from '../shared/schemas/application.entity';
import { User } from '../shared/schemas/user.entity';
import { Job } from '../shared/schemas/job.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { Company } from '../shared/schemas/company.entity';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterviewSchedule,
      Application,
      User,
      Job,
      Candidate,
      Company,
    ]),
    MailModule,
    NotificationsModule,
  ],
  controllers: [InterviewSchedulesController],
  providers: [InterviewSchedulesService],
})
export class InterviewSchedulesModule {}
