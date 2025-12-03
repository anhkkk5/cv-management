import {
  Body,
  Controller,
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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.Candidate)
  create(@Body() dto: CreateApplicationDto, @Request() req) {
    const userId = req.user.userId;
    return this.applicationsService.create(dto, userId);
  }

  @Get('me')
  @Roles(Role.Candidate)
  getMyApplications(@Request() req) {
    const userId = req.user.userId;
    return this.applicationsService.findMyApplications(userId);
  }

  @Get('job/:jobId')
  @Roles(Role.Recruiter, Role.Admin)
  getByJob(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.applicationsService.findByJob(jobId);
  }

  @Patch(':id/status')
  @Roles(Role.Recruiter, Role.Admin)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationStatusDto,
    @Request() req,
  ) {
    const recruiterId = req.user.userId;
    const isAdmin = req.user.role === Role.Admin;
    return this.applicationsService.updateStatus(id, dto.status, recruiterId, isAdmin);
  }
}
