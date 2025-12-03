import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quiz } from '@schemas/quiz.entity';
import { Question } from '@schemas/question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { User } from '@shared/schemas/user.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  // 1. Tạo bộ đề mới
  async create(createDto: CreateQuizDto, creator: User): Promise<Quiz> {
    const { questionIds, ...restDto } = createDto;

    // Tìm các câu hỏi dựa trên ID
    const selectedQuestions = await this.questionRepo.find({
      where: { id: In(questionIds) },
    });

    const newQuiz = this.quizRepo.create({
      ...restDto,
      creator: creator,
      questions: selectedQuestions, // Gán danh sách câu hỏi
    });

    return this.quizRepo.save(newQuiz);
  }

  // 2. Lấy danh sách tất cả bộ đề
  async findAll(): Promise<Quiz[]> {
    return this.quizRepo.find({
      relations: ['questions', 'creator'], // Lấy kèm câu hỏi và người tạo
      order: { createdAt: 'DESC' },
    });
  }

  // 3. Lấy chi tiết 1 bộ đề
  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'creator'],
    });
    if (!quiz) {
      throw new NotFoundException(`Không tìm thấy bộ đề với ID ${id}`);
    }
    return quiz;
  }

  // 4. Cập nhật bộ đề (Quan trọng)
  async update(id: number, updateDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id); // Lấy bộ đề cũ ra
    
    const { questionIds, ...restDto } = updateDto;

    // Cập nhật thông tin cơ bản
    Object.assign(quiz, restDto);

    // Nếu người dùng gửi danh sách câu hỏi mới -> Cập nhật quan hệ
    if (questionIds) {
      const newQuestions = await this.questionRepo.find({
        where: { id: In(questionIds) },
      });
      quiz.questions = newQuestions; // Thay thế danh sách cũ bằng mới
    }

    return this.quizRepo.save(quiz);
  }

  // 5. Xóa bộ đề
  async remove(id: number): Promise<void> {
    const quiz = await this.findOne(id);
    await this.quizRepo.remove(quiz);
  }
}