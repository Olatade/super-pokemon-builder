import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from '../routes/profile/profile.module';
import { PokemonModule } from '../routes/pokemon/pokemon.module';
import { Profile } from '../libs/database/entities/profile.entity';
import { ProfilePokemon } from '../libs/database/entities/profile-pokemon.entity';
import { Pokemon } from '../libs/database/entities/pokemon.entity';
import { PokemonAbility } from '../libs/database/entities/pokemon-ability.entity';
import { PokemonType } from '../libs/database/entities/pokemon-type.entity';
import { TeamPokemon } from '../libs/database/entities/team-pokemon.entity';
import { Team } from '../libs/database/entities/team.entity';
import { AuthGuard } from '../libs/guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'super_pokemon_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        Profile,
        ProfilePokemon,
        Pokemon,
        PokemonAbility,
        PokemonType,
        TeamPokemon,
        Team,
      ],
    }),
    ProfileModule,
    PokemonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
