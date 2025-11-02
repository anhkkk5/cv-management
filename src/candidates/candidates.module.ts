import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../shared/schemas/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}