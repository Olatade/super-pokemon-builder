import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProfilePokemon } from './profile-pokemon.entity';
import { Team } from './team.entity';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user';

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ProfilePokemon, (pp) => pp.profile, { cascade: true })
  profilePokemon: ProfilePokemon[];

  @OneToMany(() => Team, (team: Team) => team.profile)
  teams: Team[];
}