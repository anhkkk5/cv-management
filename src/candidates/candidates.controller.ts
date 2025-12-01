import { Controller, Get, Post, Body, Patch, Request, Param, ParseIntPipe, Delete, HttpCode, HttpStatus } from '@nestjs/common';

import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadedFile } from '@nestjs/common/decorators';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Candidates (Profile)')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // List all candidates (admin / recruiter)
  @Roles(Role.Admin, Role.Recruiter)
  @Get()
  findAll() {
    return this.candidatesService.findAll();
  }

  // Authenticated candidate manages own profile
  @Roles(Role.Candidate)
  @Post('me')
  createMyProfile(@Request() req, @Body() createDto: CreateCandidateDto) {
    return this.candidatesService.createMyProfile(req.user.userId, createDto);
  }

  @Roles(Role.Candidate)
  @Get('me')
  getMyProfile(@Request() req) {
    return this.candidatesService.findMyProfile(req.user.userId);
  }

  @Roles(Role.Candidate)
  @Patch('me')
  updateMyProfile(@Request() req, @Body() updateDto: UpdateCandidateDto) {
    return this.candidatesService.updateMyProfile(req.user.userId, updateDto);
  }

  // Get candidate by id (admin / recruiter)
  @Roles(Role.Admin, Role.Recruiter)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findById(id);
  }

  // Admin update candidate by id
  @Roles(Role.Admin)
  @Patch(':id')
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.updateByAdmin(id, updateDto);
  }
}