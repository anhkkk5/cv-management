// src/cvs/cvs.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@ApiTags('CVs')
@ApiBearerAuth()
@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  // Candidate: list all own CVs
  @Get('me')
  @Roles(Role.Candidate)
  getMyCvs(@Request() req) {
    return this.cvsService.findMyCvs(req.user.userId);
  }

  // Candidate: create new CV
  @Post('me')
  @Roles(Role.Candidate)
  createMyCv(@Request() req, @Body() dto: CreateCvDto) {
    return this.cvsService.create(req.user.userId, dto);
  }

  // Candidate: update one of own CVs
  @Patch('me/:id')
  @Roles(Role.Candidate)
  updateMyCv(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCvDto,
  ) {
    return this.cvsService.update(req.user.userId, id, dto);
  }

  // Candidate: delete one of own CVs
  @Delete('me/:id')
  @Roles(Role.Candidate)
  deleteMyCv(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.cvsService.remove(req.user.userId, id);
  }

  // Recruiter/Admin: view public CV by id (for job applications, search, etc.)
  @Get(':id')
  @Roles(Role.Recruiter, Role.Admin)
  getCvById(@Param('id', ParseIntPipe) id: number) {
    return this.cvsService.findPublicById(id);
  }
}