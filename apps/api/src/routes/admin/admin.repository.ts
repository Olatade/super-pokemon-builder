import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Profile } from '../../libs/database/entities/profile.entity';
import { Team } from '../../libs/database/entities/team.entity';
import { TeamPokemon } from '../../libs/database/entities/team-pokemon.entity';
import { Pokemon } from '../../libs/database/entities/pokemon.entity';
import { QueryParams } from '../../libs/database/abstract.repository';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamPokemon)
    private readonly teamPokemonRepository: Repository<TeamPokemon>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>
  ) {}

  async getStats() {
    const totalUsers = await this.profileRepository.count();
    const totalAdmins = await this.profileRepository.count({
      where: { role: 'admin' },
    });
    const totalTeams = await this.teamRepository.count();

    const popularPokemonIds = await this.teamPokemonRepository
      .createQueryBuilder('team_pokemon')
      .select('team_pokemon.pokemon_Id', 'pokemon_Id')
      .addSelect('COUNT(team_pokemon.pokemon_Id)', 'count')
      .groupBy('team_pokemon.pokemon_Id')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      totalUsers,
      totalAdmins,
      totalTeams,
      averageTeamsPerUser: totalUsers > 0 ? totalTeams / totalUsers : 0,
      popularPokemonIds,
    };
  }
}
