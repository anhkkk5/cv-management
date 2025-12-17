import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { InterviewSchedulesService } from './interview-schedules.service';
import { CreateInterviewScheduleDto } from './dto/create-interview-schedule.dto';
import { ConfirmInterviewDto } from './dto/confirm-interview.dto';
import { RequestRescheduleDto } from './dto/request-reschedule.dto';
import { RescheduleInterviewDto } from './dto/reschedule-interview.dto';

@ApiTags('interview-schedules')
@ApiBearerAuth()
@Controller('interview-schedules')
export class InterviewSchedulesController {
  constructor(
    private readonly interviewSchedulesService: InterviewSchedulesService,
  ) {}

  // Company: lấy danh sách ứng viên đã approved CV theo công ty
  @Get('company/approved-applications')
  @Roles(Role.Recruiter, Role.Admin)
  companyApprovedApplications(@Request() req) {
    return this.interviewSchedulesService.listApprovedApplicationsForCompany(
      req.user.userId,
      req.user.role === Role.Admin,
    );
  }

  // Company: xem các lịch phỏng vấn đã tạo
  @Get('company')
  @Roles(Role.Recruiter, Role.Admin)
  companySchedules(@Request() req) {
    return this.interviewSchedulesService.listCompanySchedules(
      req.user.userId,
      req.user.role === Role.Admin,
    );
  }

  // Company: tạo lịch hẹn
  @Post()
  @Roles(Role.Recruiter, Role.Admin)
  create(@Body() dto: CreateInterviewScheduleDto, @Request() req) {
    return this.interviewSchedulesService.createSchedule(
      dto,
      req.user.userId,
      req.user.role === Role.Admin,
    );
  }

  // Candidate: xem lịch phỏng vấn của tôi
  @Get('my')
  @Roles(Role.Candidate)
  my(@Request() req) {
    return this.interviewSchedulesService.listMySchedules(req.user.userId);
  }

  // Candidate: xác nhận tham gia
  @Patch(':id/confirm')
  @Roles(Role.Candidate)
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmInterviewDto,
    @Request() req,
  ) {
    return this.interviewSchedulesService.confirm(id, dto, req.user.userId);
  }

  // Candidate: xin đổi lịch
  @Patch(':id/request-reschedule')
  @Roles(Role.Candidate)
  requestReschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RequestRescheduleDto,
    @Request() req,
  ) {
    return this.interviewSchedulesService.requestReschedule(
      id,
      dto,
      req.user.userId,
    );
  }

  // Company: đổi lịch
  @Patch(':id/reschedule')
  @Roles(Role.Recruiter, Role.Admin)
  reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RescheduleInterviewDto,
    @Request() req,
  ) {
    return this.interviewSchedulesService.reschedule(
      id,
      dto,
      req.user.userId,
      req.user.role === Role.Admin,
    );
  }

  // Company/Admin: xoá lịch hẹn (trường hợp tạo nhầm)
  @Delete(':id')
  @Roles(Role.Recruiter, Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.interviewSchedulesService.remove(
      id,
      req.user.userId,
      req.user.role === Role.Admin,
    );
  }
}
