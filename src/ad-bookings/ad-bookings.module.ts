import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdBookingsService } from './ad-bookings.service';
import { AdBookingsController } from './ad-bookings.controller';
import { AdBooking } from '../shared/schemas/ad-booking.entity';
import { AdSlot } from '../shared/schemas/ad-slot.entity';
import { User } from '../shared/schemas/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdBooking, AdSlot, User])],
  controllers: [AdBookingsController],
  providers: [AdBookingsService],
  exports: [AdBookingsService],
})
export class AdBookingsModule {}
