import { CompanyAddress } from '../schemas/company-address.entity';
import { Job } from '../schemas/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ví dụ: "Hà Nội", "TP. Hồ Chí Minh"

  // Một Location có thể có nhiều địa chỉ công ty
  @OneToMany(() => CompanyAddress, (address) => address.location)
  companyAddresses: CompanyAddress[];

  // Một Location có thể có nhiều công việc
  @OneToMany(() => Job, (job) => job.location)
  jobs: Job[];
}