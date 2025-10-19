import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  // Thiết lập mối quan hệ Một-Một với User
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn() // Bảng này sẽ giữ khóa ngoại 'userId'
  user: User;

  @Column()
  name: string;

  @Column({ type: 'boolean', default: true })
  isOpen: boolean; // 1 = true (sẵn sàng), 0 = false

  @Column({ type: 'date', nullable: true })
  dob: Date; // Ngày sinh

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'smallint', nullable: true }) // 1 = nam, 0 = nữ (ví dụ)
  gender: number;

  @Column({ nullable: true })
  link_fb: string;

  @Column({ nullable: true })
  link_linkedin: string;

  @Column({ nullable: true })
  link_git: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}