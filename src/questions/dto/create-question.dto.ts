import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestionType } from '../../shared/schemas/question.entity';

export class CreateQuestionDto {
  @ApiProperty({ example: '1 + 1 = ?', description: 'Nội dung câu hỏi' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
    description: 'Loại câu hỏi',
    required: false,
  })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @ApiProperty({
    example: [
      { id: 1, text: '2' },
      { id: 2, text: '3' },
    ],
    description: 'Các lựa chọn (đối với trắc nghiệm)',
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  options?: any[];

  @ApiProperty({
    example: 1,
    description: 'Đáp án đúng (id option hoặc text)',
    required: false,
  })
  @IsOptional()
  correctAnswer?: any;

  @ApiProperty({ example: 1, description: 'Điểm số của câu hỏi', required: false })
  @IsNumber()
  @IsOptional()
  point?: number;

  @ApiProperty({
    example: 'Javascript',
    description: 'Phân loại / skillCategory (VD: Git, Javascript, English)',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}

