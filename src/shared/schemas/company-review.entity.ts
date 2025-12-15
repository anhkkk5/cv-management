// src/shared/schemas/company-review.entity.ts
import { User } from './user.entity';
import { Company } from './company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewComment } from './review-comment.entity';

@Entity('company_reviews')
export class CompanyReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  overallRating: number; // 1.0 - 5.0

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  workLifeBalance: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  salaryBenefits: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  jobStability: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  management: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  culture: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  jobTitle: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 50, default: 'current' })
  employmentStatus: string; // current, former

  @Column({ type: 'varchar', length: 50, nullable: true })
  contractType: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  pros: string; // Ưu điểm

  @Column({ type: 'text', nullable: true })
  cons: string; // Nhược điểm

  @Column({ type: 'boolean', default: false })
  recommendToFriends: boolean;

  @Column({ type: 'boolean', default: false })
  ceoRating: boolean;

  @Column({ type: 'boolean', default: false })
  businessOutlook: boolean;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number; // Số người đánh giá hữu ích

  @OneToMany(() => ReviewComment, (comment) => comment.review, { cascade: true })
  comments: ReviewComment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}



