import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { SessionStatus } from '../../common/enums';

export class QuerySessionsDto {
  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ enum: SessionStatus })
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @ApiPropertyOptional({ example: '2026-04-01T00:00:00Z' })
  @IsISO8601()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: '2026-04-30T23:59:59Z' })
  @IsISO8601()
  @IsOptional()
  to?: string;
}
