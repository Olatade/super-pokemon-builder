import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Team } from './team.entity';
import { Pokemon } from './pokemon.entity';

@Entity({ name: 'team_pokemon' })
@Unique(['team_id', 'pokemon_id']) // ← This enforces the constraint
export class TeamPokemon {
  @PrimaryColumn()
  team_id: string;

  @PrimaryColumn()
  pokemon_id: string;

  @ManyToOne(() => Team, (team) => team.teamPokemon, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Pokemon, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;

  @CreateDateColumn()
  created_at: Date;
}
