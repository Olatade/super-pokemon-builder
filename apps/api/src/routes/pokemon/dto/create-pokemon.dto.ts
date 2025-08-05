import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  category: string;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;
}
