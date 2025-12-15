// src/shared/schemas/review-comment.entity.ts
import { User } from './user.entity';
import { CompanyReview } from './company-review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('review_comments')
export class ReviewComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CompanyReview, (review) => review.comments, { onDelete: 'CASCADE' })
  review: CompanyReview;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}



