import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../../common/enums';

export class CreateAttendanceDto {
  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.ATTENDED })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional({ example: 'Arrived 5 minutes late but completed the full session' })
  @IsString()
  @IsOptional()
  notes?: string;
}
