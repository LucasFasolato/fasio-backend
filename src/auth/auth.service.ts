import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '../common/enums';
import { Professional } from '../professionals/entities/professional.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.dataSource.transaction(async (manager) => {
      const newUser = manager.create(User, {
        email: dto.email,
        passwordHash,
        role: UserRole.PROFESSIONAL,
        status: UserStatus.ACTIVE,
      });
      const savedUser = await manager.save(newUser);

      const professional = manager.create(Professional, {
        user: savedUser,
        fullName: dto.fullName,
        discipline: dto.discipline,
        phone: dto.phone ?? null,
      });
      await manager.save(professional);

      return savedUser;
    });

    return this.signToken(user);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.usersService.findByIdWithProfessional(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.professional) {
      throw new NotFoundException('Professional profile not found');
    }

    return user;
  }

  private signToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
