import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CvTemplatesService } from './cv-templates.service';
import { CreateCvTemplateDto } from './dto/create-cv-template.dto';
import { UpdateCvTemplateDto } from './dto/update-cv-template.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from '@modules/auth/decorators/public.decorator';

@ApiTags('CV Templates (System)')
@Controller('cv-templates')
export class CvTemplatesController {
  constructor(private readonly cvTemplatesService: CvTemplatesService) {}

  @Public() // Cho phép ứng viên xem mẫu mà chưa cần đăng nhập
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách mẫu CV' })
  findAll() {
    return this.cvTemplatesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết cấu trúc 1 mẫu CV' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cvTemplatesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin) // Chỉ Admin mới được tạo/sửa mẫu
  @Post()
  create(@Body() createDto: CreateCvTemplateDto) {
    return this.cvTemplatesService.create(createDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCvTemplateDto) {
    return this.cvTemplatesService.update(id, updateDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cvTemplatesService.remove(id);
  }
}