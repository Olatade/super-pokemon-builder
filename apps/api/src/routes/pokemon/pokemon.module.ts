import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from '../../libs/database/entities/pokemon.entity';
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonRepository],
  exports: [PokemonService, PokemonRepository],
})
export class PokemonModule {}
