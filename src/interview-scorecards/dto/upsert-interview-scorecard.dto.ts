import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpsertInterviewScorecardDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  technicalScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  communicationScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  cultureFitScore?: number;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  weaknesses?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsIn(['pass', 'fail', 'next_round'])
  decision: 'pass' | 'fail' | 'next_round';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  nextRound?: number;
}
