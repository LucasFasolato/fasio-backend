import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { StudentStatus } from '../../common/enums';
import { Professional } from '../../professionals/entities/professional.entity';

@Entity('students')
export class Student extends BaseEntity {
  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ name: 'professional_id' })
  professionalId: string;

  @Column()
  fullName: string;

  @Column({ nullable: true, type: 'varchar' })
  email: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;
}
