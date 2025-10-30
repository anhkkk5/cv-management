import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Companies')
@ApiBearerAuth() 
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }


  @Roles(Role.Recruiter)
  @Patch('my-company')
  updateMyCompany(@Request() req, @Body() updateDto: UpdateCompanyDto) {
    return this.companiesService.updateMyCompany(req.user.userId, updateDto);
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Post()
  create(@Body() createDto: CreateCompanyDto) {
    return this.companiesService.create(createDto);
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Patch(':id')
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateByAdmin(id, updateDto);
  }

  @Roles(Role.Admin, Role.Recruiter)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}