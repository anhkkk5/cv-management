import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RescheduleInterviewDto {
  @IsDateString()
  scheduledAt: string;

  @IsIn(['online', 'offline'])
  mode: 'online' | 'offline';

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
