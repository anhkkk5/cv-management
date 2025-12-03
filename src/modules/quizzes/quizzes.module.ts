import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz } from '@schemas/quiz.entity';
import { Question } from '@schemas/question.entity'; // Import Question

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question]), // <-- Quan trọng: Đăng ký cả 2 entity
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}