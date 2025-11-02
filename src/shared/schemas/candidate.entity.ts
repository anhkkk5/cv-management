import { User } from '../schemas/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isOpen: boolean;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'smallint', nullable: true })
  gender: number;

  @Column({ nullable: true })
  link_fb: string;

  @Column({ nullable: true })
  link_linkedin: string;

  @Column({ nullable: true })
  link_git: string;

  @Column({ nullable: true })
  introduction: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}