import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UploadMultipleImagesDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
        description: 'Multiple image files to upload',
    })
    files: Express.Multer.File[]

    @ApiProperty({
        description: 'Folder name in Cloudinary',
        required: false,
        example: 'gallery',
    })
    @IsOptional()
    @IsString()
    folder?: string
}
