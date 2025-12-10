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
import { Question } from './question.entity';
import { User } from './user.entity';
import { QuizCategory } from './question-set.entity';

export { QuizCategory };

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

  @Column({
    type: 'enum',
    enum: QuizCategory,
    nullable: false,
  })
  category: QuizCategory; // Danh mục: Kỹ năng văn phòng, Công nghệ, Kỹ năng mềm

  @Column({ nullable: true })
  skillCategory: string; // Kỹ năng cụ thể (VD: Git, Word, Excel)

  @Column({ nullable: true })
  imageUrl: string; // URL ảnh từ Cloudinary

  @ManyToOne(() => User)
  creator: User;

  @ManyToMany(() => Question, (question) => question.quizzes)
  @JoinTable({ name: 'quiz_questions' })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
