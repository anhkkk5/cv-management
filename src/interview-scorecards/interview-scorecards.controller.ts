import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UpsertInterviewScorecardDto } from './dto/upsert-interview-scorecard.dto';
import { InterviewScorecardsService } from './interview-scorecards.service';

@ApiTags('interview-scorecards')
@ApiBearerAuth()
@Controller('interview-scorecards')
export class InterviewScorecardsController {
  constructor(private readonly service: InterviewScorecardsService) {}

  // Company/Admin: upsert scorecard cho 1 schedule
  @Post(':scheduleId')
  @Roles(Role.Recruiter, Role.Admin)
  upsert(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() dto: UpsertInterviewScorecardDto,
    @Request() req,
  ) {
    return this.service.upsert(scheduleId, dto, req.user.userId, req.user.role === Role.Admin);
  }

  // Candidate: xem scorecard của tôi
  @Get('my')
  @Roles(Role.Candidate)
  my(@Request() req) {
    return this.service.listMy(req.user.userId);
  }

  // Company/Admin: xem scorecard theo schedule
  @Get(':scheduleId')
  @Roles(Role.Recruiter, Role.Admin)
  getBySchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number, @Request() req) {
    return this.service.getBySchedule(scheduleId, req.user.userId, req.user.role === Role.Admin);
  }
}
