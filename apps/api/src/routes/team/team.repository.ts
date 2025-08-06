import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AbstractRepository } from '../../libs/database/abstract.repository';
import { Team } from '../../libs/database/entities/team.entity';

@Injectable()
export class TeamRepository extends AbstractRepository<Team> {
  constructor(dataSource: DataSource) {
    super(dataSource, Team);
  }

  async findTeamsByProfileId(profileId: string): Promise<Team[]> {
    return await this.repository.find({
      where: { profile_id: profileId },
      relations: ['profile'],
    });
  }

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    const newTeam = this.repository.create(teamData);
    const savedTeam = await this.repository.save(newTeam);

    // After saving, find the newly created team and load its relations
    // This will ensure that the 'profile' relation is populated in the returned object
    return await this.repository.findOne({
      where: { id: savedTeam.id },
      relations: ['profile'], // Explicitly load profile for the response
    });
  }

  async findOneByProfileIdAndTeamId(
    profileId: string,
    teamId: string
  ): Promise<Team | null> {
    return await this.repository.findOne({
      where: { id: teamId, profile_id: profileId },
      relations: ['profile', 'teamPokemon', 'teamPokemon.pokemon'],
    });
  }

  async deleteTeam(teamId: string): Promise<void> {
    const result = await this.repository.delete(teamId);
    if (result.affected === 0) {
      throw new NotFoundException(`Team with ID ${teamId} not found.`);
    }
  }

  async findById(id: any): Promise<Team | null> {
    return super.findById(id, ['profile', 'teamPokemon', 'teamPokemon.pokemon']);
  }
}
