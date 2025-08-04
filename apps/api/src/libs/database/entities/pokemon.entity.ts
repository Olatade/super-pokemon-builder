import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PokemonType } from './pokemon-type.entity';
import { PokemonAbility } from './pokemon-ability.entity';
import { ProfilePokemon } from './profile-pokemon.entity';

@Entity({ name: 'pokemon' })
export class Pokemon {
  @PrimaryColumn()
  id: string; // Pokedex number

  @Column()
  name: string;

  @Column({ name: 'image_url', nullable: true })
  image_url?: string;

  @Column()
  category: string; // e.g., "Seed Pokémon"

  @Column('float')
  height: number;

  @Column('float')
  weight: number;

  @OneToMany(() => PokemonType, (type) => type.pokemon, { cascade: true })
  types: PokemonType[];

  @OneToMany(() => PokemonAbility, (ability) => ability.pokemon, {
    cascade: true,
  })
  abilities: PokemonAbility[];

  @OneToMany(() => ProfilePokemon, (pp) => pp.pokemon)
  profilePokemon: ProfilePokemon[];
}
