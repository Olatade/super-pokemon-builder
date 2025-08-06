import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AbstractRepository } from '../../libs/database/abstract.repository';
import { TeamPokemon } from '../../libs/database/entities/team-pokemon.entity';

@Injectable()
export class TeamPokemonRepository extends AbstractRepository<TeamPokemon> {
  constructor(dataSource: DataSource) {
    super(dataSource, TeamPokemon);
  }

  async deletePokemonFromTeam(teamId: string, pokemonId: string) {
    const result = await this.repository.delete({
      team_id: teamId,
      pokemon_id: pokemonId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Pokémon with ID ${pokemonId} not found in team with ID ${teamId}.`
      );
    }
    return result;
  }
}
