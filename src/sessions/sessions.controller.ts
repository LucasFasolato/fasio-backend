import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { successResponse } from '../common/helpers/response.helper';
import { User } from '../users/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionsDto } from './dto/query-sessions.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@ApiTags('Sessions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a session for an owned student' })
  @ApiCreatedResponse({ description: 'Session created successfully' })
  @ApiNotFoundResponse({ description: 'Student not found or not owned' })
  async create(@CurrentUser() user: User, @Body() dto: CreateSessionDto) {
    const session = await this.sessionsService.create(user.id, dto);
    return successResponse(session);
  }

  @Get()
  @ApiOperation({ summary: 'List sessions of the authenticated professional' })
  async findAll(@CurrentUser() user: User, @Query() query: QuerySessionsDto) {
    const sessions = await this.sessionsService.findAll(user.id, query);
    return successResponse(sessions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID (ownership enforced)' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    const session = await this.sessionsService.findOne(user.id, id);
    return successResponse(session);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session (ownership enforced)' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ) {
    const session = await this.sessionsService.update(user.id, id, dto);
    return successResponse(session);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a session — sets status to cancelled (ownership enforced)' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async cancel(@CurrentUser() user: User, @Param('id') id: string) {
    const session = await this.sessionsService.cancel(user.id, id);
    return successResponse(session);
  }
}
