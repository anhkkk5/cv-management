import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Job } from './job.entity';
import { Candidate } from './candidate.entity';
import { Company } from './company.entity';
import { User } from './user.entity';

export type InterviewMode = 'online' | 'offline';
export type InterviewScheduleStatus =
  | 'pending'
  | 'confirmed'
  | 'reschedule_requested'
  | 'rescheduled'
  | 'cancelled';

@Entity('interview_schedules')
export class InterviewSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  application: Application;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  candidate: Candidate;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  createdBy: User;

  @Column({ type: 'int', default: 1 })
  round: number;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'offline' })
  mode: InterviewMode;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  meetingLink?: string;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: InterviewScheduleStatus;

  @Column({ type: 'text', nullable: true })
  candidateRescheduleReason?: string;

  @Column({ type: 'text', nullable: true })
  companyRescheduleNote?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
