import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { SessionStatus } from '../common/enums';
import { Professional } from '../professionals/entities/professional.entity';
import { ProfessionalsService } from '../professionals/professionals.service';
import { Student } from '../students/entities/student.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionsDto } from './dto/query-sessions.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  async create(userId: string, dto: CreateSessionDto): Promise<Session> {
    const professional = await this.resolveOrFail(userId);
    // Validate that the target student belongs to this professional before creating the session.
    await this.findOwnedStudentOrFail(professional, dto.studentId);

    const session = this.sessionsRepository.create({
      professionalId: professional.id,
      studentId: dto.studentId,
      scheduledAt: dto.scheduledAt,
      durationMinutes: dto.durationMinutes,
      status: SessionStatus.SCHEDULED,
      location: dto.location ?? null,
      notes: dto.notes ?? null,
    });

    return this.sessionsRepository.save(session);
  }

  async findAll(userId: string, query: QuerySessionsDto): Promise<Session[]> {
    const professional = await this.resolveOrFail(userId);

    const where: FindOptionsWhere<Session> = { professionalId: professional.id };

    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    if (query.from && query.to) {
      where.scheduledAt = Between(new Date(query.from), new Date(query.to));
    } else if (query.from) {
      where.scheduledAt = MoreThanOrEqual(new Date(query.from));
    } else if (query.to) {
      where.scheduledAt = LessThanOrEqual(new Date(query.to));
    }

    return this.sessionsRepository.find({
      where,
      order: { scheduledAt: 'ASC' },
    });
  }

  async findOne(userId: string, sessionId: string): Promise<Session> {
    const professional = await this.resolveOrFail(userId);
    return this.findOwnedSessionOrFail(professional, sessionId);
  }

  async update(userId: string, sessionId: string, dto: UpdateSessionDto): Promise<Session> {
    const professional = await this.resolveOrFail(userId);
    const session = await this.findOwnedSessionOrFail(professional, sessionId);

    if (dto.scheduledAt !== undefined) session.scheduledAt = dto.scheduledAt;
    if (dto.durationMinutes !== undefined) session.durationMinutes = dto.durationMinutes;
    if (dto.location !== undefined) session.location = dto.location ?? null;
    if (dto.notes !== undefined) session.notes = dto.notes ?? null;

    return this.sessionsRepository.save(session);
  }

  // Cancel sets status to CANCELLED and keeps the record for historical tracking.
  // Status transitions (e.g. SCHEDULED → COMPLETED) will be handled via dedicated endpoints.
  async cancel(userId: string, sessionId: string): Promise<Session> {
    const professional = await this.resolveOrFail(userId);
    const session = await this.findOwnedSessionOrFail(professional, sessionId);

    session.status = SessionStatus.CANCELLED;
    return this.sessionsRepository.save(session);
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

  // Returns 404 regardless of whether the session exists or belongs to another professional.
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
}
