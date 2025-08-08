import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  profile_id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
