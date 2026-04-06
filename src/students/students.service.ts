import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentStatus } from '../common/enums';
import { Professional } from '../professionals/entities/professional.entity';
import { ProfessionalsService } from '../professionals/professionals.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  async create(userId: string, dto: CreateStudentDto): Promise<Student> {
    const professional = await this.resolveOrFail(userId);

    const student = this.studentsRepository.create({
      professional,
      professionalId: professional.id,
      fullName: dto.fullName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      status: dto.status ?? StudentStatus.ACTIVE,
      notes: dto.notes ?? null,
    });

    return this.studentsRepository.save(student);
  }

  async findAll(userId: string): Promise<Student[]> {
    const professional = await this.resolveOrFail(userId);

    return this.studentsRepository.find({
      where: { professionalId: professional.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, studentId: string): Promise<Student> {
    const professional = await this.resolveOrFail(userId);
    return this.findOwnedOrFail(professional, studentId);
  }

  async update(userId: string, studentId: string, dto: UpdateStudentDto): Promise<Student> {
    const professional = await this.resolveOrFail(userId);
    const student = await this.findOwnedOrFail(professional, studentId);

    Object.assign(student, {
      ...(dto.fullName !== undefined && { fullName: dto.fullName }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    });

    return this.studentsRepository.save(student);
  }

  // Soft delete: marks as inactive to preserve historical data (sessions, attendances, payments).
  async remove(userId: string, studentId: string): Promise<Student> {
    const professional = await this.resolveOrFail(userId);
    const student = await this.findOwnedOrFail(professional, studentId);

    student.status = StudentStatus.INACTIVE;
    return this.studentsRepository.save(student);
  }

  private async resolveOrFail(userId: string): Promise<Professional> {
    const professional = await this.professionalsService.findByUserId(userId);
    if (!professional) {
      throw new NotFoundException('Professional profile not found');
    }
    return professional;
  }

  // Returns 404 regardless of whether the student exists or belongs to another professional.
  // This prevents leaking information about the existence of resources owned by others.
  private async findOwnedOrFail(professional: Professional, studentId: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId, professionalId: professional.id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
