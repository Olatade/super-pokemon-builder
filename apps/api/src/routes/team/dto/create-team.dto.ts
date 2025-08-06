import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  profile_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
