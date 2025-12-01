// src/posts/posts.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Posts (Blog/News)')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết (có lọc)' })
  findAll(
    @Query('category') categorySlug?: string,
  ) {
    return this.postsService.findAll(categorySlug);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Xem chi tiết bài viết theo Slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  // === ADMIN API (Quản lý) ===

  @Roles(Role.Admin, Role.Recruiter)
  @Post()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user);
  }

}