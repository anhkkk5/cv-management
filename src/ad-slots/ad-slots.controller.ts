import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdSlotsService } from './ad-slots.service';
import { CreateAdSlotDto } from './dto/create-ad-slot.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('ad-slots')
@ApiBearerAuth()
@Controller('ad-slots')
export class AdSlotsController {
  constructor(private readonly adSlotsService: AdSlotsService) {}

  // Company: xem cấu hình slot quảng cáo của chính mình
  @Get('my')
  @Roles(Role.Recruiter)
  findMySlot(@Request() req) {
    const userId = req.user.userId;
    return this.adSlotsService.findMySlot(userId);
  }

  // Company: tạo/cập nhật slot quảng cáo của chính mình
  @Post('my')
  @Roles(Role.Recruiter)
  @HttpCode(HttpStatus.OK)
  upsertMySlot(@Body() dto: CreateAdSlotDto, @Request() req) {
    const userId = req.user.userId;
    return this.adSlotsService.upsertMySlot(userId, dto);
  }

  // Candidate / bất kỳ user: xem các slot đang mở cho thuê
  @Get('available')
  findAvailable() {
    return this.adSlotsService.findAvailableSlots();
  }
}
