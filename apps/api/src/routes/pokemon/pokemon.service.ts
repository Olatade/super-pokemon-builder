import { Injectable, NotFoundException } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { QueryParams } from '../../libs/database/abstract.repository';
@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async findAll(query: QueryParams) {
    return this.pokemonRepo.findAll(query);
  }

  async findOne(id: string) {
    const pokemon = await this.pokemonRepo.findById(id);
    if (!pokemon) throw new NotFoundException('Pokemon not found');
    return pokemon;
  }

  async remove(id: string) {
    await this.findOne(id); // throws if not found
    return this.pokemonRepo.delete(id);
  }
}
