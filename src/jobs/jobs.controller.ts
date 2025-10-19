// src/jobs/jobs.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe,
  HttpCode, HttpStatus,} from '@nestjs/common';
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
  @Roles(Role.Recruiter)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto, @Request() req) {
    const recruiterId = req.user.userId;
    return this.jobsService.create(createJobDto, recruiterId);
  }

  @Patch(':id')
  @Roles(Role.Recruiter)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req,
  ) {
    const recruiterId = req.user.userId;
    return this.jobsService.update(id, updateJobDto, recruiterId);
  }

  @Delete(':id')
  @Roles(Role.Recruiter) 
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const recruiterId = req.user.userId;
    return this.jobsService.remove(id, recruiterId);
  }

  @Public() 
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }
}