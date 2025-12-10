import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { QuizCategory } from '../../shared/schemas/question-set.entity';

export class CreateQuizDto {
  @ApiProperty({ example: 'Bài test Git cơ bản' })
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

  @ApiProperty({
    enum: QuizCategory,
    example: QuizCategory.TECHNOLOGY,
  })
  @IsEnum(QuizCategory)
  @IsNotEmpty()
  category: QuizCategory;

  @ApiProperty({ example: 'Git', required: false })
  @IsOptional()
  @IsString()
  skillCategory?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: [1],
    description: 'Danh sách ID question sets (sẽ lấy tất cả câu hỏi từ các sets)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  questionSetIds?: number[];

  @ApiProperty({
    example: [1, 5, 8],
    description: 'Danh sách ID các câu hỏi riêng lẻ (nếu không dùng questionSetIds)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  questionIds?: number[];
}
