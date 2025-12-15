import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.Candidate)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('cvPdf'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'number',
        },
        cvPreviewImageUrl: {
          type: 'string',
          description: 'URL ảnh preview CV (tùy chọn)',
        },
        cvPdf: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() cvPdfFile: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.applicationsService.create(createApplicationDto, userId, cvPdfFile);
  }

  @Get('me')
  @Roles(Role.Candidate)
  findMyApplications(@Request() req) {
    const userId = req.user.userId;
    return this.applicationsService.findMyApplications(userId);
  }

  @Get('job/:jobId')
  @Roles(Role.Recruiter, Role.Admin)
  findByJobId(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.applicationsService.findByJobId(jobId, userId, userRole);
  }

  @Patch(':id/status')
  @Roles(Role.Recruiter, Role.Admin)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.applicationsService.updateStatus(id, updateStatusDto, userId, userRole);
  }
}

