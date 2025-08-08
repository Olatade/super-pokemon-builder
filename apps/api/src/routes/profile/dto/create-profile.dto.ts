import { IsString, IsEmail, IsOptional, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

 @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
