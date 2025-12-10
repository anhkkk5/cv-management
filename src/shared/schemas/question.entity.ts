import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Quiz } from './quiz.entity'; // Import (sẽ tạo sau)

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice', // Trắc nghiệm 1 đáp án
  CHECKBOX = 'checkbox', // Trắc nghiệm nhiều đáp án
  TEXT = 'text', // Tự luận
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string; // Nội dung câu hỏi (VD: 1 + 1 = ?)

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  type: QuestionType;

  // Lưu các lựa chọn dưới dạng JSON.
  // VD: [{"id": 1, "text": "2"}, {"id": 2, "text": "3"}]
  @Column({ type: 'json', nullable: true })
  options: any;

  // Lưu đáp án đúng (VD: ID của option đúng, hoặc text nếu là tự luận)
  @Column({ type: 'json', nullable: true })
  correctAnswer: any;

  @Column({ default: 1 })
  point: number; // Điểm số của câu này

  @Column({ nullable: true })
  category: string; // Phân loại (VD: IQ, Javascript, English)

  // Quan hệ N-N với Quiz
  @ManyToMany(() => Quiz, (quiz) => quiz.questions)
  quizzes: Quiz[];

  // Quan hệ N-N với QuestionSet
  @ManyToMany('QuestionSet', 'questions')
  questionSets: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
