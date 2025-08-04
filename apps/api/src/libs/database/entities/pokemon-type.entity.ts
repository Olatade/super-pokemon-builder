import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity({ name: 'pokemon_types' })
export class PokemonType {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  pokemon_id: string;

  @Column()
  type: string; // e.g., "fire", "flying"

  @Column()
  slot: number; // 1 = primary, 2 = secondary

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.types, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;
}