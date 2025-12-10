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

export enum QuizCategory {
  OFFICE_SKILLS = 'Kỹ năng văn phòng',
  TECHNOLOGY = 'Công nghệ',
  SOFT_SKILLS = 'Kỹ năng mềm',
}

@Entity('question_sets')
export class QuestionSet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên danh sách câu hỏi (VD: "Git", "Word", "Excel")

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: QuizCategory,
    nullable: false,
  })
  category: QuizCategory; // Danh mục lớn: Kỹ năng văn phòng, Công nghệ, Kỹ năng mềm

  @Column({ nullable: true })
  skillCategory: string; // Kỹ năng cụ thể (VD: Git, HTML, Agile, Word, Excel)

  @ManyToOne(() => User)
  creator: User;

  @ManyToMany(() => Question, (question) => question.questionSets)
  @JoinTable({ name: 'question_set_questions' })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

