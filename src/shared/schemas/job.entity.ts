import { User } from '../schemas/user.entity';
import { Location } from '../schemas/location.entity';
import { Company } from '../schemas/company.entity'; // <-- Import Company
import { JobCategory } from 'src/common/enums/job-category.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  
  @ManyToOne(() => Company, (company) => company.recruiters, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' }) // Tự động tạo cột company_id liên kết
  company: Company;

  @Column({ type: 'json', nullable: true })
  requirements: string[];

  @Column({ nullable: true })
  salary: string;

  @Column({ type: 'json', nullable: true })
  desirable: string[];

  @Column({ type: 'json', nullable: true })
  benefits: string[];

  @ManyToOne(() => Location, (location) => location.jobs, { nullable: true })
  @JoinColumn({ name: 'location_id' }) // Map quan hệ này vào cột 'location_id'
  location: Location;

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

  @Column({ nullable: true, default: 'OPEN' })
  status: string;

  @Column({
    type: 'enum',
    enum: JobCategory,
    default: JobCategory.OTHER,
  })
  jobCategory: JobCategory;

  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  postedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}