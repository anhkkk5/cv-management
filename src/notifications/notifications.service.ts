import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../shared/schemas/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(params: {
    userId: number;
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
  }) {
    const n = this.notificationRepo.create({
      user: { id: params.userId } as any,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      read: 0,
    });
    return this.notificationRepo.save(n);
  }

  async findMy(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async markRead(id: number, userId: number) {
    const n = await this.notificationRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!n) return null;
    n.read = 1;
    return this.notificationRepo.save(n);
  }
}
