import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './common/enums/role.enum';
import { Public } from './auth/decorators/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('App')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles(Role.Admin)
  @Get('admin/dashboard')
  getAdminDashboard() {
    return { message: 'Welcome to the Admin Dashboard!' };
  }

  @Roles(Role.Admin, Role.Recruiter) 
  @Get('candidatelist')
  getCandidateList() {
    return { message: 'Here is the list of candidates.' };
  }
}