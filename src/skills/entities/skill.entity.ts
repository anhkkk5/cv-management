import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên kỹ năng (ví dụ: JavaScript)

  @Column({ nullable: true })
  level: string; // Trình độ (ví dụ: Advanced, Intermediate)

  @ManyToOne(() => User, (user) => user.skills, { onDelete: 'CASCADE' })
  user: User; // Liên kết với User (Candidate)
}