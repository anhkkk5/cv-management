import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSetsService } from './question-sets.service';
import { QuestionSetsController } from './question-sets.controller';
import { QuestionSet } from '../shared/schemas/question-set.entity';
import { Question } from '../shared/schemas/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet, Question])],
  controllers: [QuestionSetsController],
  providers: [QuestionSetsService],
  exports: [QuestionSetsService],
})
export class QuestionSetsModule {}

