import { CompanyAddress } from '../schemas/company-address.entity';
import { Job } from '../schemas/job.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => CompanyAddress, (address) => address.location)
  companyAddresses: CompanyAddress[];

  @OneToMany(() => Job, (job) => job.location)
  jobs: Job[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}