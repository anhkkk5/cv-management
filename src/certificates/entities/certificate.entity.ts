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
  certificate_name: string; // Tên chứng chỉ (ví dụ: AWS Certified Solutions Architect)

  @Column()
  organization: string; // Tổ chức cấp (ví dụ: Amazon Web Services)

  @Column({ type: 'date' })
  started_at: Date;

  @Column({ type: 'date', nullable: true })
  end_at: Date;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  user: User; // Liên kết với User (Candidate)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}