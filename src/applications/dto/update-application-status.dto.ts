import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'reviewing', 'approved', 'rejected'])
  status: string;
}
