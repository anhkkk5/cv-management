import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from '../shared/schemas/certificate.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certRepository: Repository<Certificate>,
  ) {}

  create(createDto: CreateCertificateDto, userId: number): Promise<Certificate> {
    const newCert = this.certRepository.create({ ...createDto, user: { id: userId } });
    return this.certRepository.save(newCert);
  }

  findAllForUser(userId: number): Promise<Certificate[]> {
    return this.certRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Certificate> {
    const cert = await this.certRepository.findOne({ where: { id }, relations: ['user'] });
    if (!cert) {
      throw new NotFoundException(`Không tìm thấy chứng chỉ với ID ${id}`);
    }
    if (cert.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }
    return cert;
  }

  async update(id: number, updateDto: UpdateCertificateDto, userId: number): Promise<Certificate> {
    const cert = await this.findOne(id, userId);
    Object.assign(cert, updateDto);
    return this.certRepository.save(cert);
  }

  async remove(id: number, userId: number): Promise<void> {
    const cert = await this.findOne(id, userId);
    await this.certRepository.remove(cert);
  }
}