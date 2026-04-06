import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { successResponse } from '../common/helpers/response.helper';
import { User } from '../users/entities/user.entity';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@ApiTags('Attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('sessions/:sessionId/attendance')
  @ApiOperation({ summary: 'Register attendance for an owned session' })
  @ApiNotFoundResponse({ description: 'Session not found or not owned' })
  @ApiConflictResponse({ description: 'Attendance already registered for this session' })
  async create(
    @CurrentUser() user: User,
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateAttendanceDto,
  ) {
    const attendance = await this.attendancesService.create(user.id, sessionId, dto);
    return successResponse(attendance);
  }

  @Get('students/:studentId/attendances')
  @ApiOperation({ summary: 'List attendance history for an owned student' })
  @ApiNotFoundResponse({ description: 'Student not found or not owned' })
  async findByStudent(@CurrentUser() user: User, @Param('studentId') studentId: string) {
    const attendances = await this.attendancesService.findByStudent(user.id, studentId);
    return successResponse(attendances);
  }
}
