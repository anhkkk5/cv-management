// src/shared/schemas/application.entity.ts
import { Job } from './job.entity';
import { Candidate } from './candidate.entity';
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

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  candidate: Candidate;

  @Column({ default: 'pending' })
  status: string; // pending, approved, rejected

  @Column({ type: 'varchar', length: 500, nullable: true })
  cvPdfUrl: string | null; // URL của file PDF CV đã upload

  @Column({ type: 'varchar', length: 500, nullable: true })
  cvPreviewImageUrl: string | null; // URL ảnh preview CV (để xem trong modal)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

