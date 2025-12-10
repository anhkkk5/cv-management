import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { QuestionSet, QuizCategory } from '../shared/schemas/question-set.entity';
import { Question } from '../shared/schemas/question.entity';
import { CreateQuestionSetDto } from './dto/create-question-set.dto';
import { UpdateQuestionSetDto } from './dto/update-question-set.dto';
import { User } from '../shared/schemas/user.entity';

@Injectable()
export class QuestionSetsService {
  constructor(
    @InjectRepository(QuestionSet)
    private readonly questionSetRepo: Repository<QuestionSet>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async create(
    createDto: CreateQuestionSetDto,
    creator: User,
  ): Promise<QuestionSet> {
    const { questionIds, ...restDto } = createDto;

    const selectedQuestions = await this.questionRepo.find({
      where: { id: In(questionIds) },
    });

    const newQuestionSet = this.questionSetRepo.create({
      ...restDto,
      creator: creator,
      questions: selectedQuestions,
    });

    return this.questionSetRepo.save(newQuestionSet);
  }

  async findAll(category?: QuizCategory, creatorId?: number): Promise<QuestionSet[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (creatorId) {
      where.creator = { id: creatorId };
    }

    return this.questionSetRepo.find({
      where,
      relations: ['questions', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<QuestionSet> {
    const questionSet = await this.questionSetRepo.findOne({
      where: { id },
      relations: ['questions', 'creator'],
    });
    if (!questionSet) {
      throw new NotFoundException(`Không tìm thấy danh sách câu hỏi với ID ${id}`);
    }
    return questionSet;
  }

  async update(
    id: number,
    updateDto: UpdateQuestionSetDto,
  ): Promise<QuestionSet> {
    const questionSet = await this.findOne(id);

    const { questionIds, ...restDto } = updateDto;

    Object.assign(questionSet, restDto);

    if (questionIds) {
      const newQuestions = await this.questionRepo.find({
        where: { id: In(questionIds) },
      });
      questionSet.questions = newQuestions;
    }

    return this.questionSetRepo.save(questionSet);
  }

  async remove(id: number): Promise<void> {
    const questionSet = await this.findOne(id);
    await this.questionSetRepo.remove(questionSet);
  }

  async getQuestionsFromSet(id: number): Promise<Question[]> {
    const questionSet = await this.findOne(id);
    return questionSet.questions || [];
  }
}

