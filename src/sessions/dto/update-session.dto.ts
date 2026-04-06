import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

// studentId and status are intentionally excluded:
// - studentId cannot be reassigned on an existing session
// - status changes happen via dedicated endpoints (/cancel)
export class UpdateSessionDto {
  @ApiPropertyOptional({ example: '2026-04-15T11:00:00Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;

  @ApiPropertyOptional({ example: 90 })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'Studio B' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Changed focus to flexibility' })
  @IsString()
  @IsOptional()
  notes?: string;
}
