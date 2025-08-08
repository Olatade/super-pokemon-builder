import { IsString, IsNotEmpty } from 'class-validator';

export class AddPokemonToTeamDto {
  @IsString()
  @IsNotEmpty()
  pokemon_id: string;
}
