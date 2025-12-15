import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../shared/schemas/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(createDto: CreateActivityDto, userId: number): Promise<Activity> {
    const entity = this.activityRepository.create({
      ...createDto,
      user: { id: userId } as any,
    });
    return this.activityRepository.save(entity);
  }

  findAllForUser(userId: number): Promise<Activity[]> {
    return this.activityRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!activity) {
      throw new NotFoundException('Không tìm thấy hoạt động');
    }

    if (activity.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem hoạt động này');
    }

    return activity;
  }

  async update(
    id: number,
    updateDto: UpdateActivityDto,
    userId: number,
  ): Promise<Activity> {
    const activity = await this.findOne(id, userId);
    Object.assign(activity, updateDto);
    return this.activityRepository.save(activity);
  }

  async remove(id: number, userId: number): Promise<void> {
    const activity = await this.findOne(id, userId);
    await this.activityRepository.remove(activity);
  }
}
