import { Injectable, NotFoundException } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { QueryParams } from '../../libs/database/abstract.repository';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async create(dto: CreatePokemonDto) {
    return this.pokemonRepo.create(dto);
  }

  async findAll(query: QueryParams) {
    return this.pokemonRepo.findAll(query);
  }

  async findOne(id: string) {
    const pokemon = await this.pokemonRepo.findById(id);
    if (!pokemon) throw new NotFoundException('Pokemon not found');
    return pokemon;
  }

  async update(id: string, dto: UpdatePokemonDto) {
    await this.findOne(id); // throws if not found
    return this.pokemonRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); // throws if not found
    return this.pokemonRepo.delete(id);
  }
}
