// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';
import { OneToMany } from 'typeorm';
import { Experience } from '../../experiences/entities/experience.entity';
import { Project } from '../../projects/entities/project.entity';
import { Candidate } from '../../candidates/entities/candidate.entity';
import { Education } from '../../education/entities/education.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({type: 'enum', enum: Role, default: Role.Candidate, })
  role: Role;

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
  
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}