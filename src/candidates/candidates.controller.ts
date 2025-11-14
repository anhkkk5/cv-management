import { Controller, Get, Post, Body, Patch, Request, Param, ParseIntPipe } from '@nestjs/common';

import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Candidates (Profile)')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Roles(Role.Admin, Role.Recruiter)
  @Get()
  findAll() {
    return this.candidatesService.findAll();
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findById(id);
  }

  @Post('me')
  createMyProfile(@Request() req, @Body() createDto: CreateCandidateDto) {
    return this.candidatesService.createMyProfile(req.user.userId, createDto);
  }

  @Get('me')
  getMyProfile(@Request() req) {
    return this.candidatesService.findMyProfile(req.user.userId);
  }

  @Patch('me')
  updateMyProfile(@Request() req, @Body() updateDto: UpdateCandidateDto) {
    return this.candidatesService.updateMyProfile(req.user.userId, updateDto);
  }
}