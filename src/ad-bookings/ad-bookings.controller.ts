import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdBookingsService } from './ad-bookings.service';
import { CreateAdBookingDto } from './dto/create-ad-booking.dto';
import { UpdateAdBookingStatusDto } from './dto/update-ad-booking-status.dto';
import { UpdateAdBookingPaymentDto } from './dto/update-ad-booking-payment.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('ad-bookings')
@ApiBearerAuth()
@Controller('ad-bookings')
export class AdBookingsController {
  constructor(private readonly adBookingsService: AdBookingsService) {}

  // User/Candidate gửi yêu cầu thuê quảng cáo
  @Post()
  @Roles(Role.Candidate, Role.Recruiter, Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAdBookingDto, @Request() req) {
    const userId = req.user.userId;
    return this.adBookingsService.create(dto, userId);
  }

  // Company xem các booking gửi tới slot của công ty mình
  @Get('my')
  @Roles(Role.Recruiter, Role.Admin)
  findMy(@Request() req) {
    const userId = req.user.userId;
    return this.adBookingsService.findMyBookingsForCompany(userId);
  }

  // Company duyệt / từ chối booking
  @Patch(':id/status')
  @Roles(Role.Recruiter, Role.Admin)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdBookingStatusDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.adBookingsService.updateStatus(id, dto, userId);
  }

  // Company đánh dấu thanh toán
  @Patch(':id/payment')
  @Roles(Role.Recruiter, Role.Admin)
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdBookingPaymentDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.adBookingsService.updatePayment(id, dto, userId);
  }

  // Client (candidate) lấy quảng cáo đang chạy của 1 company để hiển thị trên trang company
  @Get('company/:companyId/active')
  @HttpCode(HttpStatus.OK)
  findActiveForCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.adBookingsService.findActiveForCompany(companyId);
  }
}
