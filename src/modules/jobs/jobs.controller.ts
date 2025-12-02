// src/jobs/jobs.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe,
  HttpCode, HttpStatus, Query,} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterJobDto } from './dto/filter-job.dto';

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
  findAll(@Query() filterDto: FilterJobDto) {
    return this.jobsService.findAll(filterDto);
}

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }
}