import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ProjectsModule } from './projects/projects.module';
import { CvsController } from './cvs/cvs.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { JobsModule } from './jobs/jobs.module';
import { EducationModule } from './education/education.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SkillsModule } from './skills/skills.module';

const dbPortStr = process.env.DB_PORT;
const dbPort = dbPortStr ? parseInt(dbPortStr, 10) : 3306;
if (Number.isNaN(dbPort)) {
  throw new Error('Invalid DB_PORT environment variable');
}
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: dbPort,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ExperiencesModule,
    ProjectsModule,
    JobsModule,
    EducationModule,
    CandidatesModule,
    CertificatesModule,
    SkillsModule,
  ],
  controllers: [AppController, CvsController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}