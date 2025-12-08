// src/experiences/experiences.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('experiences')
@ApiBearerAuth()
@Roles(Role.Candidate)
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto, @Request() req) {
    const userId = req.user.userId;
    return this.experiencesService.create(createExperienceDto, userId);
  }

  @Get()
  @Roles(Role.Candidate)
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.experiencesService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.experiencesService.findOne(id, userId);
  }
  
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.experiencesService.update(id, updateExperienceDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.experiencesService.remove(id, userId);
  }
}