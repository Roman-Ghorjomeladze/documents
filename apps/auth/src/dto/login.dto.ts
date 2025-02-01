import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true })
  @MaxLength(60)
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
