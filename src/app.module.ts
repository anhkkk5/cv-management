import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

import { ExperiencesModule } from './experiences/experiences.module';
import { ProjectsModule } from './projects/projects.module';
import { JobsModule } from './jobs/jobs.module';
import { EducationModule } from './education/education.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SkillsModule } from './skills/skills.module';
import { CompaniesModule } from './companies/companies.module';
import { LocationsModule } from './locations/locations.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CompanyAddressModule } from './company-address/company-address.module';

import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionSetsModule } from './question-sets/question-sets.module';
import { ApplicationsModule } from './applications/applications.module';
import { CvsModule } from './cvs/cvs.module';

import { PostsModule } from './posts/posts.module';
import { CompanyReviewsModule } from './company-reviews/company-reviews.module';
import { ActivitiesModule } from './activities/activities.module';
import { AwardsModule } from './awards/awards.module';
import { ReferencesModule } from './references/references.module';
import { HobbiesModule } from './hobbies/hobbies.module';
import { AdSlotsModule } from './ad-slots/ad-slots.module';
import { AdBookingsModule } from './ad-bookings/ad-bookings.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Role } from './common/enums/role.enum';

const dbPortStr = process.env.DB_PORT;
const dbPort = dbPortStr ? parseInt(dbPortStr, 10) : 3306;

if (Number.isNaN(dbPort)) {
  throw new Error('Invalid DB_PORT environment variable');
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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
    CompaniesModule,
    LocationsModule,
    CloudinaryModule,
    CompanyAddressModule,
    QuizzesModule,
    QuestionsModule,
    QuestionSetsModule,
    ApplicationsModule,
    CvsModule,

    // extra modules
    PostsModule,
    CompanyReviewsModule,
    ActivitiesModule,
    AwardsModule,
    ReferencesModule,
    HobbiesModule,
    AdSlotsModule,
    AdBookingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const email = 'admin@gmail.com';
    const password = '123456';

    try {
      const exists = await this.usersService.findOneByEmail(email);
      if (!exists) {
        await this.usersService.create({
          name: 'Admin',
          email,
          password,
          confirmPassword: password,
          role: Role.Admin,
        } as any);

        // eslint-disable-next-line no-console
        console.log('Seeded default admin account:', email);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to seed default admin:', e?.message || e);
    }
  }
}
