import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
