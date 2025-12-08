import { User } from '../schemas/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  level: string;

  @ManyToOne(() => User, (user) => user.skills, { onDelete: 'CASCADE' })
  user: User;
}