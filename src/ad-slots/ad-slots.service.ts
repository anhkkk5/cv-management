import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdSlot } from '../shared/schemas/ad-slot.entity';
import { CreateAdSlotDto } from './dto/create-ad-slot.dto';
import { UpdateAdSlotDto } from './dto/update-ad-slot.dto';
import { Company } from '../shared/schemas/company.entity';

@Injectable()
export class AdSlotsService {
  constructor(
    @InjectRepository(AdSlot)
    private readonly adSlotRepository: Repository<AdSlot>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findMySlot(userId: number): Promise<AdSlot | null> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!company) {
      throw new ForbiddenException('Bạn chưa có công ty để cấu hình quảng cáo');
    }

    const slot = await this.adSlotRepository.findOne({
      where: { company: { id: company.id } },
      relations: ['company'],
    });

    return slot || null;
  }

  async upsertMySlot(userId: number, dto: CreateAdSlotDto | UpdateAdSlotDto): Promise<AdSlot> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!company) {
      throw new ForbiddenException('Bạn chưa có công ty để cấu hình quảng cáo');
    }

    let slot = await this.adSlotRepository.findOne({ where: { company: { id: company.id } } });

    if (!slot) {
      slot = this.adSlotRepository.create({
        company,
        name: dto.name,
        basePricePerMonth: dto.basePricePerMonth,
        isActive: dto.isActive ?? true,
      });
    } else {
      slot.name = dto.name ?? slot.name;
      slot.basePricePerMonth =
        typeof dto.basePricePerMonth === 'number' ? dto.basePricePerMonth : slot.basePricePerMonth;
      if (typeof dto.isActive === 'boolean') {
        slot.isActive = dto.isActive;
      }
    }

    return this.adSlotRepository.save(slot);
  }

  async findAvailableSlots(): Promise<AdSlot[]> {
    return this.adSlotRepository.find({
      where: { isActive: true },
      relations: ['company'],
    });
  }

  async findByCompanyId(companyId: number): Promise<AdSlot | null> {
    const slot = await this.adSlotRepository.findOne({
      where: { company: { id: companyId } },
      relations: ['company'],
    });

    return slot || null;
  }
}
