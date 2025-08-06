import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../../libs/database/entities/profile.entity';
import { Team } from '../../libs/database/entities/team.entity';
import { TeamPokemon } from '../../libs/database/entities/team-pokemon.entity';
import { Pokemon } from '../../libs/database/entities/pokemon.entity';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Team, TeamPokemon, Pokemon]),
    ProfileModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
