import { Company } from './company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdBooking } from './ad-booking.entity';

@Entity('ad_slots')
export class AdSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.adSlots, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column({ length: 255 })
  name: string; // Tên ô quảng cáo, ví dụ: "Banner trang công ty"

  @Column({ type: 'int', default: 0 })
  basePricePerMonth: number; // Giá cơ bản / tháng

  @Column({ default: true })
  isActive: boolean; // Công ty đang mở cho thuê hay không

  @OneToMany(() => AdBooking, (booking) => booking.slot)
  bookings: AdBooking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
