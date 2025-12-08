import { User } from '../schemas/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_education: string;

  @Column()
  major: string;

  @Column({ type: 'date' })
  started_at: Date;

  @Column({ type: 'date', nullable: true })
  end_at: Date;

  @Column({ type: 'text', nullable: true })
  info: string;
  
  @ManyToOne(() => User, (user) => user.educations, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}