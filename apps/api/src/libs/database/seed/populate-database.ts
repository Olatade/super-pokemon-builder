import { fetchAndSavePokemons } from './create-pokemon-file';
import { addPokemonsToDb } from './add-pokemon-to-db';
import { createProfilesAndTeams } from './create-profiles-and-teams';
import AppDataSource from '../../../data-source';

const count = process.argv[2] ? parseInt(process.argv[2], 10) : 150;

async function main() {
  // Step 1: Fetch and save Pokémon data to a JSON file
  await fetchAndSavePokemons(count);
  console.log('[SUCCESS] Pokémon data fetching complete.');

  // Step 2: Initialize the database connection
  await AppDataSource.initialize();
  console.log('[DB] Database connection initialized.');

  // Step 3: Populate the database with the fetched Pokémon data
  await addPokemonsToDb(AppDataSource);

  // Step 4: Create profiles and teams
  await createProfilesAndTeams(AppDataSource);

  // Step 5: Close the database connection
  await AppDataSource.destroy();
  console.log('[DB] Database connection closed.');
}

main()
  .then(() => {
    console.log('[SUCCESS] Database population complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[FATAL] An error occurred during the process:', error);
    process.exit(1);
  });
