import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Certificates')
@ApiBearerAuth()
@Roles(Role.Candidate) // Chỉ Candidate mới được quản lý chứng chỉ
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  create(@Body() createDto: CreateCertificateDto, @Request() req) {
    return this.certificatesService.create(createDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.certificatesService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.certificatesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCertificateDto, @Request() req) {
    return this.certificatesService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.certificatesService.remove(id, req.user.userId);
  }
}