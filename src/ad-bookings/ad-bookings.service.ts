import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdBooking } from '../shared/schemas/ad-booking.entity';
import { AdSlot } from '../shared/schemas/ad-slot.entity';
import { User } from '../shared/schemas/user.entity';
import { CreateAdBookingDto } from './dto/create-ad-booking.dto';
import { UpdateAdBookingStatusDto } from './dto/update-ad-booking-status.dto';
import { UpdateAdBookingPaymentDto } from './dto/update-ad-booking-payment.dto';

@Injectable()
export class AdBookingsService {
  constructor(
    @InjectRepository(AdBooking)
    private readonly adBookingRepository: Repository<AdBooking>,
    @InjectRepository(AdSlot)
    private readonly adSlotRepository: Repository<AdSlot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateAdBookingDto, userId: number): Promise<AdBooking> {
    const slot = await this.adSlotRepository.findOne({
      where: { id: dto.slotId },
      relations: ['company', 'company.user'],
    });

    if (!slot || !slot.isActive) {
      throw new NotFoundException('Slot quảng cáo không tồn tại hoặc không khả dụng');
    }

    const advertiser = await this.userRepository.findOne({ where: { id: userId } });
    if (!advertiser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (dto.months <= 0) {
      throw new BadRequestException('Số tháng thuê phải lớn hơn 0');
    }

    const totalPrice = slot.basePricePerMonth * dto.months;

    const booking = this.adBookingRepository.create({
      slot,
      advertiser,
      title: dto.title,
      content: dto.content ?? null,
      targetUrl: dto.targetUrl ?? null,
      imageUrl: dto.imageUrl ?? null,
      months: dto.months,
      totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    return this.adBookingRepository.save(booking);
  }

  // Company xem các booking gửi tới slot của mình
  async findMyBookingsForCompany(userId: number): Promise<AdBooking[]> {
    const bookings = await this.adBookingRepository.find({
      where: {
        slot: {
          company: {
            user: { id: userId },
          },
        },
      },
      relations: ['slot', 'slot.company', 'advertiser'],
      order: { created_at: 'DESC' },
    });

    return bookings;
  }

  private async findOneForCompany(bookingId: number, userId: number): Promise<AdBooking> {
    const booking = await this.adBookingRepository.findOne({
      where: { id: bookingId },
      relations: ['slot', 'slot.company', 'slot.company.user'],
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy yêu cầu thuê quảng cáo');
    }

    if (booking.slot.company.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền thao tác trên quảng cáo này');
    }

    return booking;
  }

  async updateStatus(bookingId: number, dto: UpdateAdBookingStatusDto, userId: number): Promise<AdBooking> {
    const booking = await this.findOneForCompany(bookingId, userId);
    booking.status = dto.status;

    // Nếu duyệt thì thiết lập thời gian chạy (tạm thời: từ bây giờ tới +months)
    if (dto.status === 'approved') {
      const start = new Date();
      const end = new Date(start.getTime());
      end.setMonth(end.getMonth() + booking.months);
      booking.startDate = start;
      booking.endDate = end;
    }

    return this.adBookingRepository.save(booking);
  }

  async updatePayment(bookingId: number, dto: UpdateAdBookingPaymentDto, userId: number): Promise<AdBooking> {
    const booking = await this.findOneForCompany(bookingId, userId);
    booking.paymentStatus = dto.paymentStatus;
    return this.adBookingRepository.save(booking);
  }

  // Lấy quảng cáo đang chạy cho 1 company để hiển thị ở trang company
  async findActiveForCompany(companyId: number): Promise<AdBooking | null> {
    const now = new Date();
    const booking = await this.adBookingRepository.findOne({
      where: {
        slot: { company: { id: companyId } },
        status: 'approved',
        paymentStatus: 'paid',
      },
      relations: ['slot', 'slot.company'],
      order: { created_at: 'DESC' },
    });

    if (!booking) return null;

    if (booking.startDate && booking.endDate && booking.startDate <= now && booking.endDate >= now) {
      return booking;
    }

    return null;
  }
}
