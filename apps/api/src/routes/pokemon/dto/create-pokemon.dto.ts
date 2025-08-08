import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
