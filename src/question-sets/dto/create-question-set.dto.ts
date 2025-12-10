import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { QuizCategory } from '../../shared/schemas/question-set.entity';

export class CreateQuestionSetDto {
  @ApiProperty({ example: 'Git' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

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

  @ApiProperty({
    example: [1, 5, 8],
    description: 'Danh sách ID các câu hỏi',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  questionIds: number[];
}

