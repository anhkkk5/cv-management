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
} from '@nestjs/common';
import { CompanyReviewsService } from './company-reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('company-reviews')
@Controller('company-reviews')
export class CompanyReviewsController {
  constructor(private readonly reviewsService: CompanyReviewsService) {}

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



