import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '@schemas/candidate.entity';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate]), CloudinaryModule],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}