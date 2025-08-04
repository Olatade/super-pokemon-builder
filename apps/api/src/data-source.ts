import 'dotenv/config';
import { DataSource } from 'typeorm';

// ✅ Use relative paths from *this file*, not the project root
import { Profile } from './libs/database/entities/profile.entity';
import { Pokemon } from './libs/database/entities/pokemon.entity';
import { ProfilePokemon } from './libs/database/entities/profile-pokemon.entity';
import { PokemonType } from './libs/database/entities/pokemon-type.entity';
import { PokemonAbility } from './libs/database/entities/pokemon-ability.entity';
import { TeamPokemon } from './libs/database/entities/team-pokemon.entity';
import { Team } from './libs/database/entities/team.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'super_pokemon_db',
  entities: [
    Pokemon,
    PokemonType,
    PokemonAbility,
    Profile,
    ProfilePokemon,
    TeamPokemon,
    Team,
  ],
  migrations: ['./libs/database/migrations/*.ts'], // put generated migrations here
  synchronize: false, // turn off once using migrations
});
