import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateInterviewScheduleDto {
  @IsInt()
  @Min(1)
  applicationId: number;

  @IsInt()
  @Min(1)
  @Max(20)
  round: number;

  @IsDateString()
  scheduledAt: string;

  @IsIn(['online', 'offline'])
  mode: 'online' | 'offline';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  meetingLink?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes?: number;
}
