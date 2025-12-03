import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { QuestionType } from '@schemas/question.entity';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Đâu là framework của Node.js?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({ example: [{ id: 1, text: 'NestJS' }, { id: 2, text: 'Laravel' }] })
  @IsOptional()
  options?: any;

  @ApiProperty({ example: [1] }) // ID của đáp án đúng
  @IsNotEmpty()
  correctAnswer: any;

  @ApiProperty({ example: 10 })
  @IsNumber()
  point: number;

  @ApiProperty({ example: 'Backend' })
  @IsString()
  category: string;
}