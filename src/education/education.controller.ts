import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Education')
@ApiBearerAuth()
@Roles(Role.Candidate) // Chỉ Candidate mới được quản lý học vấn
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Body() createDto: CreateEducationDto, @Request() req) {
    return this.educationService.create(createDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.educationService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.educationService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateEducationDto, @Request() req) {
    return this.educationService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.educationService.remove(id, req.user.userId);
  }
}