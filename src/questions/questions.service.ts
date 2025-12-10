import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../shared/schemas/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // 1. Tạo câu hỏi mới
  async create(createDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = this.questionRepository.create(createDto);
    return this.questionRepository.save(newQuestion);
  }

  // 2. Lấy danh sách tất cả câu hỏi (Có thể lọc theo category)
  async findAll(category?: string): Promise<Question[]> {
    if (category) {
      return this.questionRepository.find({ where: { category } });
    }
    return this.questionRepository.find({
      order: { createdAt: 'DESC' }, // Sắp xếp mới nhất lên đầu
    });
  }

  // 3. Lấy chi tiết 1 câu hỏi
  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID ${id}`);
    }
    return question;
  }

  // 4. Cập nhật câu hỏi
  async update(id: number, updateDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findOne(id); // Kiểm tra tồn tại trước

    Object.assign(question, updateDto); // Gán dữ liệu mới đè lên dữ liệu cũ

    return this.questionRepository.save(question);
  }

  // 5. Xóa câu hỏi
  async remove(id: number): Promise<void> {
    const question = await this.findOne(id); // Kiểm tra tồn tại trước
    await this.questionRepository.remove(question);
  }

  // 6. Lấy danh sách các skillCategory unique
  async getSkillCategories(category?: string): Promise<string[]> {
    const query = this.questionRepository.createQueryBuilder('question')
      .select('DISTINCT question.category', 'category')
      .where('question.category IS NOT NULL')
      .andWhere('question.category != :empty', { empty: '' });

    if (category) {
      // Nếu có category filter, có thể thêm logic filter theo category chính nếu cần
    }

    const results = await query.getRawMany();
    return results.map((r) => r.category).filter(Boolean).sort();
  }

  // 7. Lấy câu hỏi theo skillCategory
  async findBySkillCategory(skillCategory: string): Promise<Question[]> {
    return this.questionRepository.find({
      where: { category: skillCategory },
      order: { createdAt: 'DESC' },
    });
  }
}
