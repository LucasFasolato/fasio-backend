import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('professionals')
export class Professional extends BaseEntity {
  @OneToOne(() => User, (user) => user.professional)
  @JoinColumn()
  user: User;

  @Column()
  fullName: string;

  @Column()
  discipline: string;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;
}
