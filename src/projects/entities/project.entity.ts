// src/projects/entities/project.entity.ts
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  projectUrl: string; // Link tới dự án

  // Thiết lập mối quan hệ
  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;
}