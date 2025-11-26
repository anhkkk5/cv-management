import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Locations (Master Data)')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.remove(id);
  }
}