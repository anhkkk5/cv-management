import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyAddressDto } from './dto/create-company-address.dto';
import { UpdateCompanyAddressDto } from './dto/update-company-address.dto';
import { CompanyAddress } from '../shared/schemas/company-address.entity';
import { User } from '../shared/schemas/user.entity';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CompanyAddressService {
  constructor(
    @InjectRepository(CompanyAddress)
    private readonly addressRepository: Repository<CompanyAddress>,
  ) {}

  async create(createDto: CreateCompanyAddressDto, user: User): Promise<CompanyAddress> {
    let companyId: number;

    if (user.role === Role.Admin) {
      if (!createDto.companyId) {
        throw new ForbiddenException('Admin phải cung cấp companyId');
      }
      companyId = createDto.companyId;
    } else {
      if (!user.company) {
        throw new ForbiddenException('Tài khoản của bạn chưa được liên kết với công ty nào.');
      }
      companyId = user.company.id;
    }

    const newAddress = this.addressRepository.create({
      addressLine: createDto.addressLine,
      location: { id: createDto.locationId },
      company: { id: companyId },
    });
    return this.addressRepository.save(newAddress);
  }

  findByCompany(companyId: number): Promise<CompanyAddress[]> {
    return this.addressRepository.find({
      where: { company: { id: companyId } },
      relations: ['location'],
    });
  }

  findMyCompanyAddresses(user: User): Promise<CompanyAddress[]> {
    if (!user.company) {
      throw new ForbiddenException('Tài khoản của bạn chưa được liên kết với công ty nào.');
    }
    return this.findByCompany(user.company.id);
  }

  async update(id: number, updateDto: UpdateCompanyAddressDto, user: User): Promise<CompanyAddress> {
    const address = await this.addressRepository.findOne({ where: { id }, relations: ['company'] });
    if (!address) {
      throw new NotFoundException(`Không tìm thấy địa chỉ với ID ${id}`);
    }

    if (user.role === Role.Recruiter && (!user.company || address.company.id !== user.company.id)) {
      throw new ForbiddenException('Bạn không có quyền sửa địa chỉ này.');
    }
    
    const { addressLine, locationId, companyId } = updateDto;
    if (addressLine) address.addressLine = addressLine;
    if (locationId) address.location = { id: locationId } as any;
    if (companyId && user.role === Role.Admin) {
      address.company = { id: companyId } as any;
    }

    return this.addressRepository.save(address);
  }
}