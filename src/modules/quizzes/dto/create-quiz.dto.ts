import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ example: 'Bài test Java Fresher' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 45, description: 'Thời gian làm bài (phút)' })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: [1, 5, 8], description: 'Danh sách ID các câu hỏi đã chọn' })
  @IsArray()
  @IsNumber({}, { each: true })
  questionIds: number[];
}