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
import { AddPokemonToTeamDto } from './dto/add-pokemon.dto';
import { TeamPokemon } from '../../libs/database/entities/team-pokemon.entity';
import { TeamPokemonRepository } from './team-pokemon.repository';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamPokemonRepository: TeamPokemonRepository
  ) {}

  async getTeams(user: Profile, query: QueryParams) {
    // Only show all teams for admin requests
    if (user.role === 'admin') {
      return await this.teamRepository.findAllTeams(query);
    } else {
      return await this.teamRepository.findTeamsByProfileId(user.id, query);
    }
  }

  async createTeam(profileId: string, createTeamDto: CreateTeamDto) {
    const teamData = { ...createTeamDto, profile_id: profileId };
    return await this.teamRepository.createTeam(teamData);
  }

  async getTeamById(user: Profile, teamId: string) {
    let team: Team | null;
    //prevent non-admin from getting other user's teams
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
  ) {
    const team = await this.getTeamById(user, teamId);

    Object.assign(team, updateTeamDto);
    return await this.teamRepository.save(team);
  }

  async deleteTeam(user: Profile, teamId: string) {
    const team = await this.getTeamById(user, teamId);
    await this.teamRepository.deleteTeam(team.id);
  }

  async getPokemonsInTeam(user: Profile, teamId: string) {
    const team = await this.getTeamById(user, teamId);
    return team.teamPokemon;
  }

  async addPokemonToTeam(
    user: Profile,
    teamId: string,
    addPokemonDto: AddPokemonToTeamDto
  ) {
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

  async removePokemonFromTeam(
    user: Profile,
    teamId: string,
    pokemonId: string
  ) {
    await this.getTeamById(user, teamId);
    return this.teamPokemonRepository.deletePokemonFromTeam(teamId, pokemonId);
  }
}
