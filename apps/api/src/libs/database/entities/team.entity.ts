import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { TeamPokemon } from './team-pokemon.entity';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profile_id: string;

  @Column()
  name: string;

  @ManyToOne(() => Profile, (profile) => profile.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => TeamPokemon, (tp: TeamPokemon) => tp.team, { cascade: true })
  teamPokemon: TeamPokemon[];
}
