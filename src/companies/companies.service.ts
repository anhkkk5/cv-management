import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../shared/schemas/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '../shared/schemas/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createDto: CreateCompanyDto): Promise<Company> {
    const newCompany = this.companyRepository.create(createDto);
    return this.companyRepository.save(newCompany);
  }

  findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Không tìm thấy công ty với ID ${id}`);
    }
    return company;
  }

  async updateByAdmin(id: number, updateDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateDto);
    return this.companyRepository.save(company);
  }

  async updateMyCompany(userId: number, updateDto: UpdateCompanyDto): Promise<Company> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user || !user.company) {
      throw new ForbiddenException('Bạn không thuộc công ty nào để cập nhật.');
    }
    
    const companyId = user.company.id;
    return this.updateByAdmin(companyId, updateDto); 
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
  }
}