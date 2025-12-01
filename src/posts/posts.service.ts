// src/posts/posts.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from 'src/shared/schemas/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/shared/schemas/user.entity';
import defaultSlugify from 'slugify'; // Import slugify

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // Hàm hỗ trợ tạo slug
  private generateSlug(title: string): string {
    return defaultSlugify(title, { lower: true, strict: true, locale: 'vi' });
  }

  async create(createDto: CreatePostDto, author: User): Promise<Post> {
    // 1. Tạo slug nếu không có
    let slug = createDto.slug || this.generateSlug(createDto.title);

    // 2. Kiểm tra trùng slug
    const existingSlug = await this.postRepository.findOne({ where: { slug } });
    if (existingSlug) {
      // Nếu trùng, thêm timestamp vào sau để unique
      slug = `${slug}-${Date.now()}`;
    }

    const newPost = this.postRepository.create({
      ...createDto,
      slug,
      author,
      category: { id: createDto.categoryId }, // Map category
    });

    return this.postRepository.save(newPost);
  }

  // Lấy tất cả (Có lọc)
  async findAll(categorySlug?: string, search?: string): Promise<Post[]> {
    const query = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.status = :status', { status: PostStatus.PUBLISHED }); // Chỉ lấy bài đã đăng

    if (categorySlug) {
      query.andWhere('category.slug = :categorySlug', { categorySlug });
    }

    if (search) {
      query.andWhere('post.title LIKE :search', { search: `%${search}%` });
    }

    query.orderBy('post.createdAt', 'DESC');

    return query.getMany();
  }

  // Lấy chi tiết bài viết bằng Slug (SEO friendly)
  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { slug, status: PostStatus.PUBLISHED },
      relations: ['category', 'author'],
    });
    
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    // Tăng view
    post.viewCount += 1;
    await this.postRepository.save(post);

    return post;
  }

  // Admin: Xóa, Sửa (Tương tự các module khác)
  // ...
}