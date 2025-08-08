import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AbstractRepository } from '../../libs/database/abstract.repository';
import { Pokemon } from '../../libs/database/entities/pokemon.entity';

@Injectable()
export class PokemonRepository extends AbstractRepository<Pokemon> {
  constructor(dataSource: DataSource) {
    super(dataSource, Pokemon);
  }
}
