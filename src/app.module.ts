import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { UsersService } from '@modules/users/users.service';
import { ExperiencesModule } from '@modules/experiences/experiences.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { CvsController } from '@modules/cvs/cvs.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { JobsModule } from '@modules/jobs/jobs.module';
import { EducationModule } from '@modules/education/education.module';
import { CandidatesModule } from '@modules/candidates/candidates.module';
import { CertificatesModule } from '@modules/certificates/certificates.module';
import { SkillsModule } from '@modules/skills/skills.module';
import { CompaniesModule } from '@modules/companies/companies.module';
import { LocationsModule } from '@modules/locations/locations.module';
import { CompanyAddressModule } from '@modules/company-address/company-address.module';
import { Role } from './common/enums/role.enum';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { PostsModule } from '@modules/posts/posts.module';
import { PostCategoriesModule } from '@modules/post-categories/post-categories.module';
import { ToolsModule } from '@modules/tools/tools.module';
import { CvTemplatesModule } from '@modules/cv-templates/cv-templates.module';

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
    CompaniesModule,
    LocationsModule,
    CompanyAddressModule,
    CloudinaryModule,
    PostsModule,
    PostCategoriesModule,
    ToolsModule,
    CvTemplatesModule,
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