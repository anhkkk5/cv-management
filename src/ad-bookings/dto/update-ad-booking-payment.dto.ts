import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateAdBookingPaymentDto {
  @ApiProperty({ enum: ['unpaid', 'paid'] })
  @IsString()
  @IsIn(['unpaid', 'paid'])
  paymentStatus: 'unpaid' | 'paid';
}
