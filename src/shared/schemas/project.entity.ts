// src/projects/entities/project.entity.ts
import { User } from '../schemas/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  demo_link: string;

  @Column({ type: 'date', nullable: true })
  started_at: Date;

  @Column({ type: 'date', nullable: true })
  end_at: Date;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}