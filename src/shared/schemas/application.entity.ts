import { Candidate } from './candidate.entity';
import { Job } from './job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Candidate, { nullable: false, onDelete: 'CASCADE' })
  candidate: Candidate;

  @ManyToOne(() => Job, { nullable: false, onDelete: 'CASCADE' })
  job: Job;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
