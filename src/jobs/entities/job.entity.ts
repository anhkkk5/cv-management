// src/jobs/entities/job.entity.ts
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  company: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string; // "15-25 triệu VND"

  @Column({
    type: 'json', // Lưu dưới dạng JSON
    nullable: true,
  })
  desirable: string[]; // ["Kinh nghiệm với Docker", ...]

  @Column({
    type: 'json', // Lưu dưới dạng JSON
    nullable: true,
  })
  benefits: string[]; // ["Lương cạnh tranh", ...]

  @Column({ nullable: true })
  location_id: string; // "LOC001" (Sẽ tốt hơn nếu đây là một quan hệ)

  @Column({ nullable: true })
  type: string; // "FULL-TIME"

  @Column({ nullable: true })
  jobLevel: string; // "Junior"

  @Column({ nullable: true })
  experience: string; // "2-3 năm"

  @Column({ nullable: true })
  education: string; // "Đại học"

  @Column({ type: 'date', nullable: true })
  expire_at: Date; // Ngày hết hạn

  
  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  postedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}