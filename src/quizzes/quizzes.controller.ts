import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { QuizCategory } from '../shared/schemas/quiz.entity';

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
  @ApiOperation({
    summary: 'Cập nhật bộ đề (tên, thời gian, danh sách câu hỏi)',
  })
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

  // ========== ENDPOINTS CHO CANDIDATE ==========

  @Roles(Role.Candidate)
  @Get('candidate/list')
  @ApiOperation({ summary: 'Lấy danh sách quiz cho candidate' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: QuizCategory,
  })
  @ApiQuery({
    name: 'completionStatus',
    required: false,
    enum: ['completed', 'not_completed', 'all'],
  })
  findForCandidate(
    @Query('category') category?: QuizCategory,
    @Query('completionStatus') completionStatus?: 'completed' | 'not_completed' | 'all',
    @Request() req?: any,
  ) {
    return this.quizzesService.findForCandidate(
      category,
      completionStatus || 'all',
      req?.user?.id,
    );
  }

  @Roles(Role.Candidate)
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit bài làm và chấm điểm' })
  submitQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() submitDto: SubmitQuizDto,
    @Request() req,
  ) {
    return this.quizzesService.submitQuiz(id, submitDto, req.user);
  }

  @Roles(Role.Candidate)
  @Get(':id/result')
  @ApiOperation({ summary: 'Xem kết quả bài làm' })
  getAttemptResult(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.quizzesService.getAttemptResult(id, req.user.id);
  }

  @Roles(Role.Candidate)
  @Get('candidate/my-results')
  @ApiOperation({ summary: 'Lấy tất cả kết quả của candidate' })
  getMyResults(@Request() req) {
    return this.quizzesService.getCandidateAttempts(req.user.id);
  }

  @Roles(Role.Candidate)
  @Delete(':id/attempt')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa bài làm để làm lại bài test' })
  deleteAttempt(
    @Param('id', ParseIntPipe) quizId: number,
    @Request() req,
  ) {
    return this.quizzesService.deleteAttempt(quizId, req.user.id);
  }
}
