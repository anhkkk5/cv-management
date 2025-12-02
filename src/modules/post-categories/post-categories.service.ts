import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCategory } from 'src/shared/schemas/post-category.entity';
import defaultSlugify from 'slugify';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';

@Injectable()
export class PostCategoriesService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly categoryRepository: Repository<PostCategory>,
  ) {}

  // Tạo danh mục mới (Admin dùng)
  async create(createDto: CreatePostCategoryDto) {
    const { name } = createDto;
    const slug = defaultSlugify(name, { lower: true, strict: true, locale: 'vi' });
    
    const existing = await this.categoryRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Danh mục này đã tồn tại');
    }

    const newCategory = this.categoryRepository.create({ name, slug });
    return this.categoryRepository.save(newCategory);
  }

  // Lấy tất cả danh mục (Để hiển thị lên Menu)
  findAll() {
    return this.categoryRepository.find();
  }
  
  // ... các hàm update, remove nếu cần
}