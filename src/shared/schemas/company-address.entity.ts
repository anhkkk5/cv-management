import { Company } from '../schemas/company.entity';
import { Location } from '../schemas/location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company_address')
export class CompanyAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  addressLine: string;

  @ManyToOne(() => Company, (company) => company.addresses, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Location, (location) => location.companyAddresses, { onDelete: 'SET NULL' })
  location: Location;
}