import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HobbiesService } from './hobbies.service';
import { HobbiesController } from './hobbies.controller';
import { Hobby } from '../shared/schemas/hobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hobby])],
  controllers: [HobbiesController],
  providers: [HobbiesService],
  exports: [HobbiesService],
})
export class HobbiesModule {}


