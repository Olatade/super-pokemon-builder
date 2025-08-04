import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity({ name: 'pokemon_abilities' })
export class PokemonAbility {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  pokemon_id: string;

  @Column()
  ability: string; // e.g., "overgrow"

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.abilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;
}
