import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Pokemon } from './pokemon.entity';

@Entity({ name: 'profile_pokemon' })
export class ProfilePokemon {
  @PrimaryColumn()
  profile_id: string;

  @PrimaryColumn()
  pokemon_id: string;

  @ManyToOne(() => Profile, (profile) => profile.profilePokemon, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.profilePokemon, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;

  @CreateDateColumn()
  created_at: Date;
}