import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from '../shared/schemas/cv.entity';
import { Candidate } from '../shared/schemas/candidate.entity';
import { CvsService } from './cvs.service';
import { CvsController } from './cvs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, Candidate])],
  providers: [CvsService],
  controllers: [CvsController],
  exports: [CvsService],
})
export class CvsModule {}
