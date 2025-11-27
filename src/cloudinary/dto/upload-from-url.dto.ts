import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class UploadFromUrlDto {
    @ApiProperty({
        description: 'URL of the image to upload',
        example: 'https://example.com/image.jpg',
    })
    @IsNotEmpty()
    @IsUrl()
    url: string

    @ApiProperty({
        description: 'Folder name in Cloudinary',
        required: false,
        example: 'imported',
    })
    @IsOptional()
    @IsString()
    folder?: string
}
