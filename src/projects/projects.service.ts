import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '../shared/schemas/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    const newProject = this.projectRepository.create({
      ...createProjectDto,
      user: { id: userId },
    });
    return this.projectRepository.save(newProject);
  }

  findAllForUser(userId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number): Promise<Project> {
  
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['user'] });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
    
    return project;
  }

  
  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<Project> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectRepository.remove(project);
  }
}