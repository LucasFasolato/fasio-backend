import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalsRepository: Repository<Professional>,
  ) {}

  findByUserId(userId: string): Promise<Professional | null> {
    return this.professionalsRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
