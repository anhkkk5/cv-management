import { User } from './user.entity';
import { AdSlot } from './ad-slot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AdBookingStatus = 'pending' | 'approved' | 'rejected';
export type AdBookingPaymentStatus = 'unpaid' | 'paid';

@Entity('ad_bookings')
export class AdBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AdSlot, (slot) => slot.bookings, {
    onDelete: 'CASCADE',
  })
  slot: AdSlot;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  advertiser: User; // Người thuê quảng cáo (tạm dùng User chung)

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  targetUrl: string | null; // Link chuyển hướng khi click quảng cáo

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null; // Ảnh banner (Cloudinary)

  @Column({ type: 'int', default: 1 })
  months: number; // Số tháng thuê

  @Column({ type: 'int', default: 0 })
  totalPrice: number; // Tổng tiền phải trả

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: AdBookingStatus;

  @Column({ type: 'varchar', length: 20, default: 'unpaid' })
  paymentStatus: AdBookingPaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
