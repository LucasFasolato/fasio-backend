import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { SessionStatus } from '../../common/enums';
import { Professional } from '../../professionals/entities/professional.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('sessions')
export class Session extends BaseEntity {
  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus;

  @Column({ nullable: true, type: 'varchar' })
  location: string | null;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;
}
