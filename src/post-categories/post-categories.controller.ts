import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PostCategoriesService } from './post-categories.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';


@ApiTags('Post Categories')
@Controller('post-categories')
export class PostCategoriesController {
  constructor(private readonly categoriesService: PostCategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đề mục (Hiển thị menu)' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.Admin) // Chỉ Admin mới được tạo đề mục
  @Post()
  @ApiOperation({ summary: 'Tạo đề mục mới' })
  create(@Body() createDto: CreatePostCategoryDto) {
    return this.categoriesService.create(createDto);
  }
}