import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyReview } from '../shared/schemas/company-review.entity';
import { ReviewComment } from '../shared/schemas/review-comment.entity';
import { Company } from '../shared/schemas/company.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CompanyReviewsService {
  constructor(
    @InjectRepository(CompanyReview)
    private readonly reviewRepository: Repository<CompanyReview>,
    @InjectRepository(ReviewComment)
    private readonly commentRepository: Repository<ReviewComment>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number): Promise<CompanyReview> {
    // Kiểm tra công ty có tồn tại không
    const company = await this.companyRepository.findOne({
      where: { id: createReviewDto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    // Kiểm tra xem user đã review công ty này chưa
    const existingReview = await this.reviewRepository.findOne({
      where: {
        company: { id: company.id },
        user: { id: userId },
      },
    });

    if (existingReview) {
      throw new ConflictException('Bạn đã đánh giá công ty này rồi');
    }

    // Tạo review mới
    const review = this.reviewRepository.create({
      ...createReviewDto,
      company,
      user: { id: userId },
    });

    return this.reviewRepository.save(review);
  }

  async findAll(companyId?: number): Promise<CompanyReview[]> {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.company', 'company')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .orderBy('review.created_at', 'DESC');

    if (companyId) {
      query.where('review.company.id = :companyId', { companyId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<CompanyReview> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['company', 'user', 'comments', 'comments.user'],
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy review');
    }

    return review;
  }

  async findByCompanyId(companyId: number): Promise<CompanyReview[]> {
    return this.reviewRepository.find({
      where: { company: { id: companyId } },
      relations: ['user', 'comments', 'comments.user'],
      order: { created_at: 'DESC' },
    });
  }

  async addComment(
    reviewId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<ReviewComment> {
    const review = await this.findOne(reviewId);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      review,
      user: { id: userId },
    });

    return this.commentRepository.save(comment);
  }

  async markHelpful(reviewId: number): Promise<CompanyReview> {
    const review = await this.findOne(reviewId);
    review.helpfulCount = (review.helpfulCount || 0) + 1;
    return this.reviewRepository.save(review);
  }

  async getCompanyStats(companyId: number) {
    const reviews = await this.findByCompanyId(companyId);

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reviewsByJob: {},
        reviewsByStatus: { current: 0, former: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + Number(r.overallRating), 0);
    const averageRating = totalRating / reviews.length;

    const reviewsByJob: Record<string, number> = {};
    reviews.forEach((r) => {
      if (r.jobTitle) {
        reviewsByJob[r.jobTitle] = (reviewsByJob[r.jobTitle] || 0) + 1;
      }
    });

    const reviewsByStatus = {
      current: reviews.filter((r) => r.employmentStatus === 'current').length,
      former: reviews.filter((r) => r.employmentStatus === 'former').length,
    };

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      reviewsByJob,
      reviewsByStatus,
    };
  }
}



