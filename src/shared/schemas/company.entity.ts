import { User } from '../schemas/user.entity';
import { Job } from '../schemas/job.entity';
import { CompanyAddress } from '../schemas/company-address.entity';
import { AdSlot } from './ad-slot.entity';

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

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  policies: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  github: string;

  @OneToMany(() => User, (user) => user.company)
  recruiters: User[];
  
  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(() => CompanyAddress, (address) => address.company)
  addresses: CompanyAddress[];

  @OneToMany(() => AdSlot, (slot) => slot.company)
  adSlots: AdSlot[];

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}