import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request } from '@nestjs/common';
import { CompanyAddressService } from './company-address.service';
import { CreateCompanyAddressDto } from './dto/create-company-address.dto';
import { UpdateCompanyAddressDto } from './dto/update-company-address.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Company Address')
@Controller('company-address')
export class CompanyAddressController {
  constructor(private readonly companyAddressService: CompanyAddressService) {}

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Recruiter)
  @Post()
  create(@Body() createDto: CreateCompanyAddressDto, @Request() req) {
    return this.companyAddressService.create(createDto, req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.Recruiter)
  @Get('my-company')
  findMyCompanyAddresses(@Request() req) {
    return this.companyAddressService.findMyCompanyAddresses(req.user);
  }

  @Public()
  @Get('company/:companyId')
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.companyAddressService.findByCompany(companyId);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Recruiter)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCompanyAddressDto, @Request() req) {
    return this.companyAddressService.update(id, updateDto, req.user);
  }
}