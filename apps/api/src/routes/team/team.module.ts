import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../../libs/database/entities/team.entity';
import { TeamPokemon } from '../../libs/database/entities/team-pokemon.entity';
import { TeamPokemonRepository } from './team-pokemon.repository';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamPokemon])],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository, TeamPokemonRepository],
  exports: [TeamService, TeamRepository, TeamPokemonRepository],
})
export class TeamModule {}
