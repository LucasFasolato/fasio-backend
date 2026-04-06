import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { AttendanceStatus } from '../../common/enums';
import { Session } from '../../sessions/entities/session.entity';

@Entity('attendances')
export class Attendance extends BaseEntity {
  @OneToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id', unique: true })
  sessionId: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;
}
