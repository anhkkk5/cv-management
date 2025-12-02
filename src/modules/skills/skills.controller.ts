import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Skills')
@ApiBearerAuth()
@Roles(Role.Candidate) // Chỉ Candidate mới được quản lý kỹ năng
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createDto: CreateSkillDto, @Request() req) {
    return this.skillsService.create(createDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.skillsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.skillsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSkillDto, @Request() req) {
    return this.skillsService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.skillsService.remove(id, req.user.userId);
  }
}