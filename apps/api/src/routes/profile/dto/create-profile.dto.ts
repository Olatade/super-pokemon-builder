import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}