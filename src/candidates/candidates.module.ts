import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../shared/schemas/candidate.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate]), CloudinaryModule],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}