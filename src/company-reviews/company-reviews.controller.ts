import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompanyReviewsService } from './company-reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { CompanyReviewStatus } from 'src/shared/schemas/company-review.entity';

@ApiTags('company-reviews')
@Controller('company-reviews')
export class CompanyReviewsController {
  constructor(private readonly reviewsService: CompanyReviewsService) {}

  @Get('admin')
  @Roles(Role.Admin)
  adminFindAll(
    @Query('companyId') companyId?: string,
    @Query('status') status?: string,
  ) {
    const id = companyId ? parseInt(companyId, 10) : undefined;
    const st = status as CompanyReviewStatus | undefined;
    return this.reviewsService.adminFindAll({ companyId: id, status: st });
  }

  @Get('admin/:id')
  @Roles(Role.Admin)
  adminFindOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.adminGetOne(id);
  }

  @Patch('admin/:id/approve')
  @Roles(Role.Admin)
  adminApprove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.adminApprove(id);
  }

  @Patch('admin/:id/reject')
  @Roles(Role.Admin)
  adminReject(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.adminReject(id);
  }

  @Delete('admin/:id')
  @Roles(Role.Admin)
  adminDeleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.adminDeleteReview(id);
  }

  @Delete('admin/comments/:commentId')
  @Roles(Role.Admin)
  adminDeleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.reviewsService.adminDeleteComment(commentId);
  }

  @Post()
  @Roles(Role.Candidate)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const userId = req.user.userId;
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Public()
  @Get()
  findAll(@Query('companyId') companyId?: string) {
    const id = companyId ? parseInt(companyId, 10) : undefined;
    return this.reviewsService.findAll(id);
  }

  @Public()
  @Get('company/:companyId')
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.reviewsService.findByCompanyId(companyId);
  }

  @Public()
  @Get('company/:companyId/stats')
  getCompanyStats(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.reviewsService.getCompanyStats(companyId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Post(':id/comments')
  @Roles(Role.Candidate, Role.Recruiter)
  @HttpCode(HttpStatus.CREATED)
  addComment(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.reviewsService.addComment(reviewId, createCommentDto, userId);
  }

  @Post(':id/helpful')
  @Public()
  @HttpCode(HttpStatus.OK)
  markHelpful(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewsService.markHelpful(reviewId);
  }
}



