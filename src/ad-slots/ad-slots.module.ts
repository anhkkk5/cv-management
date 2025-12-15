import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdSlotsService } from './ad-slots.service';
import { AdSlotsController } from './ad-slots.controller';
import { AdSlot } from '../shared/schemas/ad-slot.entity';
import { Company } from '../shared/schemas/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdSlot, Company])],
  controllers: [AdSlotsController],
  providers: [AdSlotsService],
  exports: [AdSlotsService],
})
export class AdSlotsModule {}
