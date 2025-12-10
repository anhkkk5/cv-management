import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class SubmitQuizDto {
  @ApiProperty({
    example: {
      '1': [1, 2],
      '2': [3],
      '3': 'Câu trả lời tự luận',
    },
  })
  @IsObject()
  @IsNotEmpty()
  answers: Record<string, any>;
}

