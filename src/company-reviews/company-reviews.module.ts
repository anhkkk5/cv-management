import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyReviewsService } from './company-reviews.service';
import { CompanyReviewsController } from './company-reviews.controller';
import { CompanyReview } from '../shared/schemas/company-review.entity';
import { ReviewComment } from '../shared/schemas/review-comment.entity';
import { Company } from '../shared/schemas/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyReview, ReviewComment, Company])],
  controllers: [CompanyReviewsController],
  providers: [CompanyReviewsService],
  exports: [CompanyReviewsService],
})
export class CompanyReviewsModule {}



