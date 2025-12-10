import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Questions (Question Bank)')
@ApiBearerAuth()
@Roles(Role.Recruiter, Role.Admin)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // --- TẠO MỚI ---
  @Post()
  @ApiOperation({ summary: 'Tạo câu hỏi mới vào ngân hàng' })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  // --- LẤY DANH SÁCH ---
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách câu hỏi (có thể lọc theo category)' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Lọc theo danh mục (VD: IQ, Java)',
  })
  findAll(@Query('category') category?: string) {
    return this.questionsService.findAll(category);
  }

  // --- LẤY DANH SÁCH SKILL CATEGORIES (phải đặt trước route có param) ---
  @Get('skill-categories/list')
  @ApiOperation({ summary: 'Lấy danh sách các kỹ năng cụ thể (skillCategory) có trong database' })
  getSkillCategories() {
    return this.questionsService.getSkillCategories();
  }

  // --- LẤY CÂU HỎI THEO SKILL CATEGORY (phải đặt trước route :id) ---
  @Get('skill/:skillCategory')
  @ApiOperation({
    summary: 'Lấy danh sách câu hỏi theo skill category (Git, HTML, Agile)',
  })
  findBySkillCategory(@Param('skillCategory') skillCategory: string) {
    return this.questionsService.findBySkillCategory(skillCategory);
  }

  // --- LẤY CHI TIẾT ---
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một câu hỏi' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  // --- CẬP NHẬT ---
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật nội dung câu hỏi' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  // --- XÓA ---
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa câu hỏi khỏi ngân hàng' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}
