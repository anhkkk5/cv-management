// src/cvs/cvs.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('CVs')
@ApiBearerAuth()
@Controller('cvs')
export class CvsController {

  @Get('search')
  @Roles(Role.Recruiter, Role.Admin)
  searchAllCvs() {
    return 'Returning a list of all searchable CVs for Recruiters.';
  }
}