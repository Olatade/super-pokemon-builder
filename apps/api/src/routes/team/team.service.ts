import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryParams } from '../../libs/database/abstract.repository';
import { TeamRepository } from './team.repository';
import { Team } from '../../libs/database/entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Profile } from '../../libs/database/entities/profile.entity';
import { AddPokemonDto } from './dto/add-pokemon.dto';
import { TeamPokemon } from '../../libs/database/entities/team-pokemon.entity';
import { TeamPokemonRepository } from './team-pokemon.repository';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamPokemonRepository: TeamPokemonRepository
  ) {}

  async getTeams(
    user: Profile,
    query: QueryParams
  ): Promise<{ data: Partial<Team>[]; meta: any }> {
    if (user.role === 'admin') {
      return await this.teamRepository.findAllTeams(query);
    } else {
      return await this.teamRepository.findTeamsByProfileId(user.id, query);
    }
  }

  async createTeam(
    profileId: string,
    createTeamDto: CreateTeamDto
  ): Promise<Team> {
    const teamData = { ...createTeamDto, profile_id: profileId };
    return await this.teamRepository.createTeam(teamData);
  }

  async getTeamById(user: Profile, teamId: string): Promise<Team> {
    let team: Team | null;

    if (user.role === 'admin') {
      team = await this.teamRepository.findById(teamId);
    } else {
      team = await this.teamRepository.findOneByProfileIdAndTeamId(
        user.id,
        teamId
      );
    }

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found.`);
    }
    return team;
  }

  async updateTeam(
    user: Profile,
    teamId: string,
    updateTeamDto: UpdateTeamDto
  ): Promise<Team> {
    const team = await this.getTeamById(user, teamId);

    Object.assign(team, updateTeamDto);
    return await this.teamRepository.save(team);
  }

  async deleteTeam(user: Profile, teamId: string): Promise<void> {
    const team = await this.getTeamById(user, teamId);
    await this.teamRepository.deleteTeam(team.id);
  }

  async getPokemonsInTeam(
    user: Profile,
    teamId: string
  ): Promise<TeamPokemon[]> {
    const team = await this.getTeamById(user, teamId);
    return team.teamPokemon;
  }

  async addPokemonToTeam(
    user: Profile,
    teamId: string,
    addPokemonDto: AddPokemonDto
  ): Promise<Team> {
    const team = await this.getTeamById(user, teamId);

    // don't allow add if team already has 6 pokemons
    if (team.teamPokemon && team.teamPokemon.length >= 6) {
      throw new BadRequestException(
        'Team is full. Cannot add more than 6 Pokémon.'
      );
    }

    const newTeamPokemon = new TeamPokemon();
    newTeamPokemon.team_id = team.id;
    newTeamPokemon.pokemon_id = addPokemonDto.pokemon_id;

    await this.teamPokemonRepository.save(newTeamPokemon);

    return await this.getTeamById(user, teamId);
  }

  async removePokemonFromTeam(user: Profile, teamId: string, pokemonId: string) {
    await this.getTeamById(user, teamId);
    return  this.teamPokemonRepository.deletePokemonFromTeam(teamId, pokemonId);
  }
}
