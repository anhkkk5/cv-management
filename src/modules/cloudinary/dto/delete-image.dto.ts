import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteImageDto {
    @ApiProperty({
        description: 'Public ID of the image in Cloudinary',
        example: 'lms-api/image123',
    })
    @IsNotEmpty()
    @IsString()
    publicId: string
}
