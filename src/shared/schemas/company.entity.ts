import { User } from '../schemas/user.entity';
import { Job } from '../schemas/job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fullName: string;

  @JoinColumn()
  email: User;

  @Column({ unique: true })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  website: string;

  @OneToOne(() => User, (user) => user.company)
  recruiters: User;
  
  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}