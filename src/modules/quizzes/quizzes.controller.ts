import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Quizzes (Assessments)')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  // --- TẠO MỚI (Recruiter & Admin) ---
  @Roles(Role.Recruiter, Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Tạo bộ đề thi mới từ ngân hàng câu hỏi' })
  create(@Body() createDto: CreateQuizDto, @Request() req) {
    return this.quizzesService.create(createDto, req.user);
  }

  // --- LẤY DANH SÁCH (Recruiter & Admin) ---
  @Roles(Role.Recruiter, Role.Admin)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các bộ đề thi' })
  findAll() {
    return this.quizzesService.findAll();
  }

  // --- LẤY CHI TIẾT (Ai cũng được xem, kể cả Candidate khi làm bài) ---
  @Roles(Role.Recruiter, Role.Admin, Role.Candidate)
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết bộ đề và danh sách câu hỏi' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.findOne(id);
  }

  // --- CẬP NHẬT (Recruiter & Admin) ---
  @Roles(Role.Recruiter, Role.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bộ đề (tên, thời gian, danh sách câu hỏi)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateQuizDto,
  ) {
    return this.quizzesService.update(id, updateDto);
  }

  // --- XÓA (Recruiter & Admin) ---
  @Roles(Role.Recruiter, Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa bộ đề thi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.remove(id);
  }
}