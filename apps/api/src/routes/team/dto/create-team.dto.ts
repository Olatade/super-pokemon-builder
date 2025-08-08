import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsOptional()
  @IsString()
  profile_id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
