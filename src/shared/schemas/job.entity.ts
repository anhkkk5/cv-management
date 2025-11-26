// src/shared/schemas/job.entity.ts
import { User } from '../schemas/user.entity';
import { Location } from '../schemas/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  company: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ nullable: true })
  salary: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  desirable: string[]; 

  @Column({
    type: 'json',
    nullable: true,
  })
  benefits: string[]; 

  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  jobLevel: string;

  @Column({ nullable: true })
  experience: string; 

  @Column({ nullable: true })
  education: string;

  @Column({ type: 'date', nullable: true })
  expire_at: Date;

  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  postedBy: User;

  @ManyToOne(() => Location, (location) => location.jobs, { nullable: true })
  location: Location;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}