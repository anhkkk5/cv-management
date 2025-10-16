// src/cvs/cvs.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('cvs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CvsController {

  @Get('search')
  @Roles(Role.Recruiter, Role.Admin)
  searchAllCvs() {
    return 'Returning a list of all searchable CVs for Recruiters.';
  }
}