import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../professionals/entities/professional.entity';
import { ProfessionalsService } from '../professionals/professionals.service';
import { Session } from '../sessions/entities/session.entity';
import { Student } from '../students/entities/student.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendancesRepository: Repository<Attendance>,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  async create(
    userId: string,
    sessionId: string,
    dto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const professional = await this.resolveOrFail(userId);
    await this.findOwnedSessionOrFail(professional, sessionId);

    const existing = await this.attendancesRepository.findOne({
      where: { sessionId },
    });
    if (existing) {
      throw new ConflictException('Attendance already registered for this session');
    }

    const attendance = this.attendancesRepository.create({
      sessionId,
      status: dto.status,
      notes: dto.notes ?? null,
    });

    return this.attendancesRepository.save(attendance);
  }

  async findByStudent(userId: string, studentId: string): Promise<Attendance[]> {
    const professional = await this.resolveOrFail(userId);
    await this.findOwnedStudentOrFail(professional, studentId);

    return this.attendancesRepository.find({
      where: {
        session: {
          studentId,
          professionalId: professional.id,
        },
      },
      relations: { session: true },
      order: { createdAt: 'DESC' },
    });
  }

  private async resolveOrFail(userId: string): Promise<Professional> {
    const professional = await this.professionalsService.findByUserId(userId);
    if (!professional) {
      throw new NotFoundException('Professional profile not found');
    }
    return professional;
  }

  private async findOwnedSessionOrFail(
    professional: Professional,
    sessionId: string,
  ): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId, professionalId: professional.id },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  private async findOwnedStudentOrFail(
    professional: Professional,
    studentId: string,
  ): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId, professionalId: professional.id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }
}
