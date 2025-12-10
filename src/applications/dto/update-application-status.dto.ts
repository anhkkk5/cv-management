import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateApplicationStatusDto {
  @ApiProperty({ 
    example: 'pending', 
    description: 'Trạng thái ứng tuyển',
    enum: ['pending', 'approved', 'rejected']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'approved', 'rejected'])
  status: string;
}

