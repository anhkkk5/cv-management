// src/cvs/cvs.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('CVs')
@ApiBearerAuth()
@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post('me')
  @Roles(Role.Candidate)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCvDto: CreateCvDto, @Request() req) {
    const userId = req.user.userId;
    return this.cvsService.create(createCvDto, userId);
  }

  @Get('me')
  @Roles(Role.Candidate)
  findMyCVs(@Request() req) {
    const userId = req.user.userId;
    return this.cvsService.findMyCVs(userId);
  }

  @Get('me/:id')
  @Roles(Role.Candidate)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.cvsService.findOne(id, userId);
  }

  @Patch('me/:id')
  @Roles(Role.Candidate)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.cvsService.update(id, updateCvDto, userId);
  }

  @Delete('me/:id')
  @Roles(Role.Candidate)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.cvsService.remove(id, userId);
  }

  @Get('search')
  @Roles(Role.Recruiter, Role.Admin)
  searchAllCvs() {
    return this.cvsService.searchAllCVs();
  }
}