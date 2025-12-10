import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz } from '../shared/schemas/quiz.entity';
import { Question } from '../shared/schemas/question.entity';
import { QuizAttempt } from '../shared/schemas/quiz-attempt.entity';
import { QuestionSet } from '../shared/schemas/question-set.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, QuizAttempt, QuestionSet]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
