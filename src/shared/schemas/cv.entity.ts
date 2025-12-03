import { Candidate } from './candidate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cvs')
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Candidate, { nullable: false, onDelete: 'CASCADE' })
  candidate: Candidate;

  @Column({ length: 255 })
  title: string; // Tên CV, ví dụ: "CV Fresher Frontend"

  @Column({ type: 'text', nullable: true })
  summary: string; // Tóm tắt / giới thiệu bản thân

  @Column({ nullable: true })
  position: string; // Vị trí mong muốn

  @Column({ nullable: true })
  location: string; // Địa chỉ hiển thị trên CV

  @Column({ nullable: true })
  avatarUrl: string; // Ảnh đại diện hiển thị trên CV

  @Column({ nullable: true })
  phone: string; // Cho phép khác với user nếu cần

  @Column({ nullable: true })
  email: string; // Cho phép khác với user nếu cần

  @Column({ type: 'boolean', default: false })
  isDefault: boolean; // CV mặc định

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
