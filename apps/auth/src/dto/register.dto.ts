import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsString()
  @MaxLength(60)
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @MaxLength(60)
  lastName: string;

  @ApiProperty({ required: true })
  @MaxLength(60)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;
}
