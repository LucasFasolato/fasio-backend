import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: '2026-04-15T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @ApiProperty({ example: 60 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiPropertyOptional({ example: 'Studio A' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Focus on core strength' })
  @IsString()
  @IsOptional()
  notes?: string;
}
