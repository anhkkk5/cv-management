import { Controller, Get, Patch, Param, ParseIntPipe, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('my')
  @Roles(Role.Candidate, Role.Recruiter, Role.Admin)
  my(@Request() req) {
    return this.notificationsService.findMy(req.user.userId);
  }

  @Patch(':id/read')
  @Roles(Role.Candidate, Role.Recruiter, Role.Admin)
  markRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notificationsService.markRead(id, req.user.userId);
  }
}
