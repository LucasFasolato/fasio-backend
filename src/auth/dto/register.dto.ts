import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @Transform(({ value }) => (value as string)?.toLowerCase()?.trim())
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Fitness Coach' })
  @IsString()
  @IsNotEmpty()
  discipline: string;

  @ApiPropertyOptional({ example: '+54 9 11 1234 5678' })
  @IsString()
  @IsOptional()
  phone?: string;
}
