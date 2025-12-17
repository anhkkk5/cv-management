// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';
import { OneToMany } from 'typeorm';
import { Experience } from '../schemas/experience.entity';
import { Project } from '../schemas/project.entity';
import { Candidate } from '../schemas/candidate.entity';
import { Education } from '../schemas/education.entity';
import { Activity } from '../schemas/activity.entity';
import { Award } from '../schemas/award.entity';
import { Job } from '../schemas/job.entity';
import { Certificate } from '../schemas/certificate.entity';
import { Skill } from '../schemas/skill.entity';
import { Company } from '../schemas/company.entity';
import { Reference } from '../schemas/reference.entity';
import { Hobby } from '../schemas/hobby.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Candidate })
  role: Role;

  @Column({ nullable: false })
  name: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailOtpHash: string | null;

  @Column({ type: 'datetime', nullable: true })
  emailOtpExpiresAt: Date | null;

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToOne(() => Candidate, (candidate) => candidate.user)
  candidateProfile: Candidate;

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  @OneToMany(() => Job, (job) => job.postedBy)
  jobs: Job[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate[];

  @OneToMany(() => Skill, (skill) => skill.user)
  skills: Skill[];

  @ManyToOne(() => Company, (company) => company.recruiters, { nullable: true })
  company: Company;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => Award, (award) => award.user)
  awards: Award[];

  @OneToMany(() => Reference, (reference) => reference.user)
  references: Reference[];

  @OneToMany(() => Hobby, (hobby) => hobby.user)
  hobbies: Hobby[];

  @BeforeInsert()
  async hashPassword() {
    if (typeof this.password === 'string' && this.password.startsWith('$2')) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
}
