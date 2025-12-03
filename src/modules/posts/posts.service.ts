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

  async updateById(id: number, updateDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['category', 'author'] });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    // Handle slug changes or title -> slug generation
    let slug = post.slug;
    if (updateDto.slug) {
      slug = updateDto.slug;
    } else if (updateDto.title && !post.slug) {
      slug = this.generateSlug(updateDto.title);
    } else if (updateDto.title && !updateDto.slug) {
      // regenerate from title if title changed and no explicit slug provided
      slug = this.generateSlug(updateDto.title);
    }

    // Check slug uniqueness
    if (slug) {
      const existing = await this.postRepository.findOne({ where: { slug } });
      if (existing && existing.id !== post.id) {
        // make unique like create()
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Apply updates
    Object.assign(post, updateDto);
    if (slug) post.slug = slug;
    if (updateDto.categoryId !== undefined) {
      post.category = { id: updateDto.categoryId } as any;
    }

    return this.postRepository.save(post);
  }

  // Admin: Cập nhật theo slug
  async update(slug: string, updateDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { slug }, relations: ['category', 'author'] });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    // Determine new slug
    let newSlug = updateDto.slug ?? (updateDto.title ? this.generateSlug(updateDto.title) : post.slug);

    if (newSlug) {
      const existing = await this.postRepository.findOne({ where: { slug: newSlug } });
      if (existing && existing.id !== post.id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    Object.assign(post, updateDto);
    if (newSlug) post.slug = newSlug;
    if (updateDto.categoryId !== undefined) {
      post.category = { id: updateDto.categoryId } as any;
    }

    return this.postRepository.save(post);
  }

  // Admin: Xóa theo id
  async deleteById(id: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    await this.postRepository.delete(id);
  }

  // Admin: Xóa theo slug (optional helper)
  async deleteBySlug(slug: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { slug } });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    await this.postRepository.delete(post.id);
  }
}