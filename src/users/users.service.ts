// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../shared/schemas/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<Partial<User>[]> {
    return this.usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'role',
      ],
      order: { id: 'ASC' },
    });
  }

  async findAllByRole(role: string): Promise<Partial<User>[]> {
    return this.usersRepository.find({
      where: { role: role as any },
      select: [
        'id',
        'name',
        'email',
        'role',
      ],
      order: { id: 'ASC' },
    });
  }
}