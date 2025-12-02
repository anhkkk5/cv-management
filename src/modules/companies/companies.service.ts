import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@shared/schemas/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '@shared/schemas/user.entity';

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

    if (!user) {
      throw new ForbiddenException('Không tìm thấy người dùng.');
    }

    // If user has no company, create and link a new one
    if (!user.company) {
      const created = this.companyRepository.create(updateDto as any) as unknown as Company;
      // Link the creating user to the company to populate companies.userId
      (created as any).user = user;
      const savedCompany = await this.companyRepository.save(created as unknown as Company);
      // Also link back from user -> company
      user.company = savedCompany as Company;
      await this.usersRepository.save(user);
      // Reload without circular relations
      return this.findOne(savedCompany.id);
    }

    const companyId = user.company.id;
    // Update and reload without relations
    const updated = await this.updateByAdmin(companyId, updateDto);
    return this.findOne(updated.id);
  }

  async getMyCompany(userId: number): Promise<Company> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    if (user.company) {
      return this.findOne(user.company.id);
    }
    // Fallback: find by companies.user relation, then reload without relations
    const byUser = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (byUser) {
      // link back for next calls
      user.company = byUser;
      await this.usersRepository.save(user);
      return this.findOne(byUser.id);
    }
    throw new NotFoundException('Bạn chưa thuộc công ty nào');
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);

    // Clear recruiters' company relation to satisfy FK constraint
    const recruiters = await this.usersRepository.find({
      where: { company: { id } },
      relations: ['company'],
    });

    if (recruiters.length > 0) {
      for (const user of recruiters) {
        user.company = null as any;
      }
      await this.usersRepository.save(recruiters);
    }

    await this.companyRepository.remove(company);
  }
}