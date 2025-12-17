import { IsNotEmpty, IsString } from 'class-validator';

export class RequestRescheduleDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
