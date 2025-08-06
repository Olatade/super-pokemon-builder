import { IsString, IsNotEmpty } from 'class-validator';

export class AddPokemonDto {
  @IsString()
  @IsNotEmpty()
  pokemon_id: string;
}
