import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../schemas/post.entity';

@Entity('post_categories')
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ví dụ: "Góc nghề nghiệp"

  @Column({ unique: true })
  slug: string; // Ví dụ: "goc-nghe-nghiep"

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}