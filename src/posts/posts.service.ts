// src/posts/posts.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../shared/schemas/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postRepository.create({
      ...createPostDto,
      status: createPostDto.status || 'draft',
      views: 0,
    });

    return this.postRepository.save(newPost);
  }

  findAll(category?: string, keyword?: string, status?: string): Promise<Post[]> {
    const qb = this.postRepository.createQueryBuilder('post');

    if (category && category.trim()) {
      qb.andWhere('post.category = :category', { category });
    }

    if (keyword && keyword.trim()) {
      qb.andWhere(
        '(LOWER(post.title) LIKE :keyword OR LOWER(post.content) LIKE :keyword OR LOWER(post.excerpt) LIKE :keyword)',
        { keyword: `%${keyword.toLowerCase()}%` },
      );
    }

    if (status && status.trim()) {
      qb.andWhere('post.status = :status', { status });
    }

    return qb.orderBy('post.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }
    // Tăng lượt xem
    post.views = (post.views || 0) + 1;
    await this.postRepository.save(post);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}

