import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '@shared/schemas/question.entity';
import { User } from '@shared/schemas/user.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // VD: Bài test năng lực Java Senior

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 30 })
  duration: number; // Thời gian làm bài (phút)

  @ManyToOne(() => User) // Ai là người tạo bộ đề này
  creator: User;

  // TRÁI TIM CỦA TÍNH NĂNG:
  // Quan hệ Nhiều-Nhiều: Một bộ đề chứa nhiều câu hỏi
  @ManyToMany(() => Question, (question) => question.quizzes)
  @JoinTable({ name: 'quiz_questions' }) // Tên bảng trung gian
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}