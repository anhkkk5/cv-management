import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('cv_templates')
export class CvTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên mẫu (VD: Mẫu Thanh lịch)

  @Column({ nullable: true })
  thumbnail: string; // Link ảnh demo mẫu CV

  @Column({ type: 'text', nullable: true })
  description: string;

  // Cấu hình màu sắc mặc định của mẫu
  @Column({ type: 'json', nullable: true })
  colorConfig: {
    primary: string;   // Màu chính
    secondary: string; // Màu phụ
    text: string;      // Màu chữ
    background: string; // Màu nền
  };

  /**
   * TRÁI TIM CỦA HỆ THỐNG:
   * Lưu trữ cấu trúc các Block (Thông tin, Kinh nghiệm, Kỹ năng...)
   * Dưới dạng JSON để Frontend có thể render động.
   */
  @Column({ type: 'json' })
  layoutConfig: CvLayoutConfig[]; // Chúng ta sẽ định nghĩa Interface này bên dưới

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Interface hỗ trợ TypeScript (Không lưu vào DB)
export interface CvLayoutConfig {
  blockId: string;    // VD: 'experience', 'education'
  title: string;      // Tiêu đề hiển thị: 'Kinh nghiệm làm việc'
  type: 'list' | 'text' | 'profile' | 'skill'; // Loại block
  fields: CvField[];  // Các trường trong block
  order: number;      // Thứ tự hiển thị
  column: 1 | 2;      // Cột hiển thị (nếu là layout 2 cột)
}

export interface CvField {
  name: string;       // key của field (vd: company_name)
  label: string;      // Label hiển thị (vd: Tên công ty)
  type: 'text' | 'date' | 'textarea' | 'number';
  required?: boolean;
}