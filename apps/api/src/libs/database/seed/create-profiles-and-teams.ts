import { DataSource, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { Team } from '../entities/team.entity';
import { Pokemon } from '../entities/pokemon.entity';
import * as fs from 'fs';
import * as path from 'path';
import { TeamPokemon } from '../entities/team-pokemon.entity';

/**
 * Reads profiles from a JSON file and returns them.
 * @returns {any[]} An array of profile data.
 */
function getProfilesFromFile(): any[] {
  const profilesPath = path.join(__dirname, 'profiles.json');
  const profilesFile = fs.readFileSync(profilesPath, 'utf8');
  return JSON.parse(profilesFile);
}

/**
 * Creates and saves profiles in the database.
 * @param {DataSource} dataSource - The data source for database operations.
 * @param {any[]} profilesData - An array of profile data to be saved.
 * @returns {Promise<Profile[]>} A promise that resolves with an array of the saved profiles.
 */
async function createProfiles(
  dataSource: DataSource,
  profilesData: any[]
): Promise<Profile[]> {
  const profileRepository = dataSource.getRepository(Profile);
  const profiles = profileRepository.create(profilesData);
  return await profileRepository.save(profiles);
}

/**
 * Creates teams for the first three non-admin users.
 * @param {DataSource} dataSource - The data source for database operations.
 * @param {Profile[]} profiles - An array of profiles to screen for team creation.
 */
async function createTeamsForUsers(
  dataSource: DataSource,
  profiles: Profile[]
): Promise<void> {
  const teamRepository = dataSource.getRepository(Team);
  const pokemonRepository = dataSource.getRepository(Pokemon);

  const users = profiles.filter((p) => p.role === 'user').slice(0, 3);

  for (const user of users) {
    const team = teamRepository.create({
      profile_id: user.id,
      name: `${user.username}'s Team`,
    });
    await teamRepository.save(team);

    const pokemons = await pokemonRepository
      .createQueryBuilder()
      .orderBy('RANDOM()')
      .limit(6)
      .getMany();

    team.teamPokemon = pokemons.map((pokemon) => ({
      team_id: team.id,
      pokemon_id: pokemon.id,
      team: team,
      pokemon: pokemon,
      created_at: new Date(),
    }));

    await teamRepository.save(team);
  }
}

async function clearTables(
  profileRepo: Repository<Profile>,
  teamRepo: Repository<Team>,
  teamPokemonRepo: Repository<TeamPokemon>
): Promise<void> {
  console.log('[SEED] Clearing existing data...');
  await teamPokemonRepo.query('DELETE FROM "team_pokemon"');
  await teamRepo.query('DELETE FROM "teams"');
  await profileRepo.query('DELETE FROM "profiles"');
  console.log('[SEED] Database cleared.');
}

/**
 * Populates the database with profiles and creates teams for the first three non-admin users.
 * @param {DataSource} dataSource - The data source for database operations.
 */
export async function createProfilesAndTeams(
  dataSource: DataSource
): Promise<void> {
  try {
    const profileRepo = dataSource.getRepository(Profile);
    const teamRepo = dataSource.getRepository(Team);
    const teamPokemonRepo = dataSource.getRepository(TeamPokemon);

    await clearTables(profileRepo, teamRepo, teamPokemonRepo);
    // Read profiles from the JSON file
    const profilesData = getProfilesFromFile();

    // Create and save profiles
    const savedProfiles = await createProfiles(dataSource, profilesData);
    console.log('[SUCCESS] Profiles created successfully.');

    // Create teams for the first three non-admin users
    await createTeamsForUsers(dataSource, savedProfiles);
    console.log('[SUCCESS] Teams created successfully.');
  } catch (error) {
    console.error(
      '[ERROR] An error occurred while creating profiles and teams:',
      error
    );
    throw error;
  }
}
