import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  AbstractRepository,
  QueryParams,
} from '../../libs/database/abstract.repository';
import { Team } from '../../libs/database/entities/team.entity';

@Injectable()
export class TeamRepository extends AbstractRepository<Team> {
  constructor(dataSource: DataSource) {
    super(dataSource, Team);
  }

  async findTeamsByProfileId(profileId: string, query: QueryParams) {
    // Apply the profile_id filter directly to the query object
    const queryWithProfileFilter = { ...query, profile_id: profileId };
    return await this.findAll(queryWithProfileFilter, [
      'profile',
      'teamPokemon',
      'teamPokemon.pokemon',
    ]);
  }

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    const newTeam = this.repository.create(teamData);
    const savedTeam = await this.repository.save(newTeam);

    // After saving, find the newly created team and load its relations
    // so that the 'profile' relation is populated in the returned object
    return await this.repository.findOne({
      where: { id: savedTeam.id },
      relations: ['profile'],
    });
  }

  async findOneByProfileIdAndTeamId(profileId: string, teamId: string) {
    return await this.repository.findOne({
      where: { id: teamId, profile_id: profileId },
      relations: ['profile', 'teamPokemon', 'teamPokemon.pokemon'],
    });
  }

  async deleteTeam(teamId: string) {
    const result = await this.repository.delete(teamId);
    if (result.affected === 0) {
      throw new NotFoundException(`Team with ID ${teamId} not found.`);
    }
  }

  async findAllTeams(query: QueryParams) {
    return await this.findAll(query, [
      'profile',
      'teamPokemon',
      'teamPokemon.pokemon',
    ]);
  }

  async findById(id: string) {
    return super.findById(id, [
      'profile',
      'teamPokemon',
      'teamPokemon.pokemon',
    ]);
  }
}
