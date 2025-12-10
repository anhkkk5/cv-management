import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quiz } from '../shared/schemas/quiz.entity';
import { Question } from '../shared/schemas/question.entity';
import { QuizAttempt } from '../shared/schemas/quiz-attempt.entity';
import { QuestionSet, QuizCategory } from '../shared/schemas/question-set.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { User } from '../shared/schemas/user.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepo: Repository<QuizAttempt>,
    @InjectRepository(QuestionSet)
    private readonly questionSetRepo: Repository<QuestionSet>,
  ) {}

  // 1. Tạo bộ đề mới
  async create(createDto: CreateQuizDto, creator: User): Promise<Quiz> {
    const { questionIds, questionSetIds, ...restDto } = createDto;

    let selectedQuestions: Question[] = [];

    // Nếu có questionSetIds, lấy tất cả câu hỏi từ các question sets
    if (questionSetIds && questionSetIds.length > 0) {
      const questionSets = await this.questionSetRepo.find({
        where: { id: In(questionSetIds) },
        relations: ['questions'],
      });

      const questionIdsFromSets = new Set<number>();
      questionSets.forEach((set) => {
        set.questions?.forEach((q) => questionIdsFromSets.add(q.id));
      });

      if (questionIdsFromSets.size > 0) {
        selectedQuestions = await this.questionRepo.find({
          where: { id: In(Array.from(questionIdsFromSets)) },
        });
      }
    }

    // Nếu có questionIds, thêm vào
    if (questionIds && questionIds.length > 0) {
      const additionalQuestions = await this.questionRepo.find({
      where: { id: In(questionIds) },
    });
      const existingIds = new Set(selectedQuestions.map((q) => q.id));
      additionalQuestions.forEach((q) => {
        if (!existingIds.has(q.id)) {
          selectedQuestions.push(q);
        }
      });
    }

    if (selectedQuestions.length === 0) {
      throw new NotFoundException(
        'Vui lòng chọn ít nhất một câu hỏi hoặc một danh sách câu hỏi',
      );
    }

    const newQuiz = this.quizRepo.create({
      ...restDto,
      creator: creator,
      questions: selectedQuestions,
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
    const quiz = await this.findOne(id);

    const { questionIds, questionSetIds, ...restDto } = updateDto;

    Object.assign(quiz, restDto);

    if (questionSetIds || questionIds) {
      let selectedQuestions: Question[] = [];

      if (questionSetIds && questionSetIds.length > 0) {
        const questionSets = await this.questionSetRepo.find({
          where: { id: In(questionSetIds) },
          relations: ['questions'],
        });

        const questionIdsFromSets = new Set<number>();
        questionSets.forEach((set) => {
          set.questions?.forEach((q) => questionIdsFromSets.add(q.id));
        });

        if (questionIdsFromSets.size > 0) {
          selectedQuestions = await this.questionRepo.find({
            where: { id: In(Array.from(questionIdsFromSets)) },
          });
        }
      }

      if (questionIds && questionIds.length > 0) {
        if (selectedQuestions.length === 0) {
          selectedQuestions = await this.questionRepo.find({
            where: { id: In(questionIds) },
          });
        } else {
          const additionalQuestions = await this.questionRepo.find({
        where: { id: In(questionIds) },
      });
          const existingIds = new Set(selectedQuestions.map((q) => q.id));
          additionalQuestions.forEach((q) => {
            if (!existingIds.has(q.id)) {
              selectedQuestions.push(q);
            }
          });
        }
      }

      if (selectedQuestions.length > 0) {
        quiz.questions = selectedQuestions;
      }
    }

    return this.quizRepo.save(quiz);
  }

  // 5. Xóa bộ đề
  async remove(id: number): Promise<void> {
    const quiz = await this.findOne(id);
    await this.quizRepo.remove(quiz);
  }

  // 6. Lấy danh sách quiz cho candidate (với filter)
  async findForCandidate(
    category?: QuizCategory,
    completionStatus?: 'completed' | 'not_completed' | 'all',
    candidateId?: number,
  ): Promise<Quiz[]> {
    const query = this.quizRepo
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .leftJoinAndSelect('quiz.creator', 'creator');

    if (category) {
      query.andWhere('quiz.category = :category', { category });
    }

    if (completionStatus && completionStatus !== 'all' && candidateId) {
      if (completionStatus === 'completed') {
        query.innerJoin(
          'quiz_attempts',
          'attempt',
          'attempt.quizId = quiz.id AND attempt.candidateId = :candidateId AND attempt.isCompleted = true',
        );
        query.setParameter('candidateId', candidateId);
      } else if (completionStatus === 'not_completed') {
        const attemptedQuizIds = await this.quizAttemptRepo
          .createQueryBuilder('attempt')
          .select('attempt.quizId', 'quizId')
          .where('attempt.candidateId = :candidateId', { candidateId })
          .andWhere('attempt.isCompleted = true')
          .getRawMany();

        const quizIds = attemptedQuizIds.map((a) => a.quizId);
        if (quizIds.length > 0) {
          query.andWhere('quiz.id NOT IN (:...quizIds)', { quizIds });
        }
      }
    }

    return query.orderBy('quiz.createdAt', 'DESC').getMany();
  }

  // 7. Submit bài làm và tự động chấm điểm
  async submitQuiz(
    quizId: number,
    submitDto: SubmitQuizDto,
    candidate: User,
  ): Promise<QuizAttempt> {
    const quiz = await this.findOne(quizId);

    if (!quiz.questions || quiz.questions.length === 0) {
      throw new NotFoundException('Quiz không có câu hỏi nào');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const questionMap = new Map(
      quiz.questions.map((q) => [q.id.toString(), q]),
    );

    for (const [questionIdStr, userAnswer] of Object.entries(
      submitDto.answers,
    )) {
      const question = questionMap.get(questionIdStr);
      if (!question) continue;

      const correctAnswer = question.correctAnswer;

      let isCorrect = false;
      if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
        isCorrect =
          correctAnswer.length === userAnswer.length &&
          correctAnswer.every((ans) => userAnswer.includes(ans));
      } else if (!Array.isArray(correctAnswer) && !Array.isArray(userAnswer)) {
        isCorrect = correctAnswer === userAnswer;
      }

      if (isCorrect) {
        correctCount++;
      }
    }

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;

    const attempt = this.quizAttemptRepo.create({
      quiz,
      candidate,
      answers: submitDto.answers,
      score,
      correctAnswers: correctCount,
      totalQuestions,
      isCompleted: true,
      completedAt: new Date(),
    });

    return this.quizAttemptRepo.save(attempt);
  }

  // 8. Lấy kết quả bài làm
  async getAttemptResult(
    quizId: number,
    candidateId: number,
  ): Promise<QuizAttempt> {
    const attempt = await this.quizAttemptRepo.findOne({
      where: {
        quiz: { id: quizId },
        candidate: { id: candidateId },
        isCompleted: true,
      },
      relations: ['quiz', 'quiz.questions', 'candidate'],
    });

    if (!attempt) {
      throw new NotFoundException('Không tìm thấy kết quả bài làm');
    }

    return attempt;
  }

  // 9. Lấy tất cả kết quả của candidate
  async getCandidateAttempts(candidateId: number): Promise<QuizAttempt[]> {
    return this.quizAttemptRepo.find({
      where: { candidate: { id: candidateId }, isCompleted: true },
      relations: ['quiz', 'quiz.questions'],
      order: { completedAt: 'DESC' },
    });
  }

  // 10. Xóa attempt để cho phép làm lại
  async deleteAttempt(quizId: number, candidateId: number): Promise<void> {
    const attempt = await this.quizAttemptRepo.findOne({
      where: {
        quiz: { id: quizId },
        candidate: { id: candidateId },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Không tìm thấy bài làm');
    }

    await this.quizAttemptRepo.remove(attempt);
  }
}
