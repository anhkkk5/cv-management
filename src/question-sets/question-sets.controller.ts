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
import { QuestionSetsService } from './question-sets.service';
import { CreateQuestionSetDto } from './dto/create-question-set.dto';
import { UpdateQuestionSetDto } from './dto/update-question-set.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { QuizCategory } from '../shared/schemas/question-set.entity';

@ApiTags('Question Sets')
@ApiBearerAuth()
@Roles(Role.Recruiter, Role.Admin)
@Controller('question-sets')
export class QuestionSetsController {
  constructor(private readonly questionSetsService: QuestionSetsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh sách câu hỏi mới' })
  create(@Body() createDto: CreateQuestionSetDto, @Request() req) {
    return this.questionSetsService.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách question sets' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: QuizCategory,
  })
  findAll(
    @Query('category') category?: QuizCategory,
    @Request() req?: any,
  ) {
    return this.questionSetsService.findAll(category, req?.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết question set' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionSetsService.findOne(id);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'Lấy câu hỏi từ question set' })
  getQuestions(@Param('id', ParseIntPipe) id: number) {
    return this.questionSetsService.getQuestionsFromSet(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật question set' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateQuestionSetDto,
  ) {
    return this.questionSetsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa question set' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionSetsService.remove(id);
  }
}

