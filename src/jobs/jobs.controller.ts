// src/jobs/jobs.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe,
  HttpCode, HttpStatus, Query,} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@ApiBearerAuth()

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}


  @Post()
  @Roles(Role.Recruiter, Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto, @Request() req) {
    const recruiterId = req.user.userId;
    return this.jobsService.create(createJobDto, recruiterId);
  }

  @Patch(':id')
  @Roles(Role.Recruiter, Role.Admin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req,
  ) {
    const recruiterId = req.user.userId;
    const isAdmin = req.user.role === Role.Admin;
    return this.jobsService.update(id, updateJobDto, recruiterId, isAdmin);
  }

  @Delete(':id')
  @Roles(Role.Recruiter, Role.Admin) 
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const recruiterId = req.user.userId;
    const isAdmin = req.user.role === Role.Admin;
    return this.jobsService.remove(id, recruiterId, isAdmin);
  }

  @Public() 
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.jobsService.findAll(city, keyword);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }
}