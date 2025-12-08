import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from '../shared/schemas/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // Chỉ Admin
  create(createDto: CreateLocationDto) {
    const newLocation = this.locationRepository.create(createDto);
    return this.locationRepository.save(newLocation);
  }

  // Công khai
  findAll() {
    return this.locationRepository.find();
  }

  // Công khai
  async findOne(id: number) {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Không tìm thấy địa điểm với ID ${id}`);
    }
    return location;
  }

  // Chỉ Admin
  async update(id: number, updateDto: UpdateLocationDto) {
    const location = await this.findOne(id);
    Object.assign(location, updateDto);
    return this.locationRepository.save(location);
  }

  // Chỉ Admin
  async remove(id: number) {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }
}