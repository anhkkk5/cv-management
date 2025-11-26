import { Module } from '@nestjs/common';
import { CompanyAddressService } from './company-address.service';
import { CompanyAddressController } from './company-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyAddress } from '../shared/schemas/company-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyAddress])],
  controllers: [CompanyAddressController],
  providers: [CompanyAddressService],
})
export class CompanyAddressModule {}