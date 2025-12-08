import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UploadImageDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file to upload',
    })
    file: Express.Multer.File

    @ApiProperty({
        description: 'Folder name in Cloudinary',
        required: false,
        example: 'products',
    })
    @IsOptional()
    @IsString()
    folder?: string
}
