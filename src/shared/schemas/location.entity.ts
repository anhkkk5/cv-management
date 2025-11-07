import { CompanyAddress } from '../schemas/company-address.entity';
import { Job } from '../schemas/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CompanyAddress, (address) => address.location)
  companyAddresses: CompanyAddress[];

  @OneToMany(() => Job, (job) => job.location)
  jobs: Job[];
}