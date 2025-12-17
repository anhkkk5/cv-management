import { IsOptional, IsString } from 'class-validator';

export class ConfirmInterviewDto {
  @IsOptional()
  @IsString()
  note?: string;
}
