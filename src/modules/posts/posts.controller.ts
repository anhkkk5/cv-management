// src/posts/posts.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdatePostDto } from './dto/update-post.dto';

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

  @Roles(Role.Admin, Role.Recruiter)
  @Patch(':slug')
  @ApiOperation({ summary: 'Cập nhật bài viết theo slug (Admin)' })
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(slug, updatePostDto);
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Patch('id/:id')
  @ApiOperation({ summary: 'Cập nhật bài viết theo id (Admin)' })
  updateById(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updateById(Number(id), updatePostDto);
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Delete('id/:id')
  @ApiOperation({ summary: 'Xóa bài viết theo id (Admin)' })
  deleteById(@Param('id') id: string) {
    return this.postsService.deleteById(Number(id));
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Delete(':slug')
  @ApiOperation({ summary: 'Xóa bài viết theo slug (Admin)' })
  deleteBySlug(@Param('slug') slug: string) {
    return this.postsService.deleteBySlug(slug);
  }
}