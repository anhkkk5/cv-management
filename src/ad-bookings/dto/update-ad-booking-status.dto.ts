import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateAdBookingStatusDto {
  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  @IsString()
  @IsIn(['pending', 'approved', 'rejected'])
  status: 'pending' | 'approved' | 'rejected';
}
