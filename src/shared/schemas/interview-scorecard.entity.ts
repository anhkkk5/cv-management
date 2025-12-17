import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InterviewSchedule } from './interview-schedule.entity';
import { User } from './user.entity';

export type InterviewDecision = 'pass' | 'fail' | 'next_round';

@Entity('interview_scorecards')
export class InterviewScorecard {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => InterviewSchedule, { onDelete: 'CASCADE' })
  @JoinColumn()
  schedule: InterviewSchedule;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  createdBy: User;

  @Column({ type: 'int', nullable: true })
  technicalScore?: number;

  @Column({ type: 'int', nullable: true })
  communicationScore?: number;

  @Column({ type: 'int', nullable: true })
  cultureFitScore?: number;

  @Column({ type: 'text', nullable: true })
  strengths?: string;

  @Column({ type: 'text', nullable: true })
  weaknesses?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 20 })
  decision: InterviewDecision;

  @Column({ type: 'int', nullable: true })
  nextRound?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
