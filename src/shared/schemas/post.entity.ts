import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../schemas/user.entity';
import { PostCategory } from './post-category.entity';

export enum PostStatus {
  DRAFT = 'draft',       // Bản nháp
  PUBLISHED = 'published', // Đã đăng
  HIDDEN = 'hidden',     // Đã ẩn
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  thumbnail: string; // URL ảnh bìa (từ Cloudinary)

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả ngắn

  @Column({ type: 'longtext' }) // Nội dung bài viết (HTML dài)
  content: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  // Quan hệ: 1 Bài viết thuộc 1 Danh mục
  @ManyToOne(() => PostCategory, (cate) => cate.posts, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: PostCategory;

  // Quan hệ: 1 Bài viết thuộc 1 Tác giả (Admin)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ default: 0 })
  viewCount: number; // Đếm lượt xem

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}