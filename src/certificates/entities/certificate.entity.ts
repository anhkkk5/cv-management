import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên chứng chỉ (ví dụ: AWS Certified Solutions Architect)

  @Column()
  issuer: string; // Tổ chức cấp (ví dụ: Amazon Web Services)

  @Column({ type: 'date', nullable: true })
  issueDate: Date; // Ngày cấp

  @Column({ nullable: true })
  credentialID: string; // Mã chứng chỉ (tùy chọn)

  @Column({ nullable: true })
  credentialURL: string; // Link xác thực (tùy chọn)

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  user: User; // Liên kết với User (Candidate)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}