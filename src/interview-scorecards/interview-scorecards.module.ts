import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewScorecardsController } from './interview-scorecards.controller';
import { InterviewScorecardsService } from './interview-scorecards.service';
import { InterviewScorecard } from '../shared/schemas/interview-scorecard.entity';
import { InterviewSchedule } from '../shared/schemas/interview-schedule.entity';
import { User } from '../shared/schemas/user.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { Company } from '../shared/schemas/company.entity';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterviewScorecard,
      InterviewSchedule,
      User,
      Candidate,
      Company,
    ]),
    MailModule,
    NotificationsModule,
  ],
  controllers: [InterviewScorecardsController],
  providers: [InterviewScorecardsService],
})
export class InterviewScorecardsModule {}
