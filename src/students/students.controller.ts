import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { successResponse } from '../common/helpers/response.helper';
import { User } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a student for the authenticated professional' })
  async create(@CurrentUser() user: User, @Body() dto: CreateStudentDto) {
    const student = await this.studentsService.create(user.id, dto);
    return successResponse(student);
  }

  @Get()
  @ApiOperation({ summary: 'List all students of the authenticated professional' })
  async findAll(@CurrentUser() user: User) {
    const students = await this.studentsService.findAll(user.id);
    return successResponse(students);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID (ownership enforced)' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    const student = await this.studentsService.findOne(user.id, id);
    return successResponse(student);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student (ownership enforced)' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    const student = await this.studentsService.update(user.id, id, dto);
    return successResponse(student);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a student (soft delete, ownership enforced)' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    const student = await this.studentsService.remove(user.id, id);
    return successResponse(student);
  }
}
