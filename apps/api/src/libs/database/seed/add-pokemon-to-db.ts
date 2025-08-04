import { DataSource, Repository } from 'typeorm';
import { readJson } from 'fs-extra';
import * as path from 'path';
import { Pokemon } from '../entities/pokemon.entity';
import { PokemonType } from '../entities/pokemon-type.entity';
import { PokemonAbility } from '../entities/pokemon-ability.entity';

interface RawPokemonData {
  id: string;
  name: string;
  image_url: string;
  category: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
}

export async function addPokemonsToDb(dataSource: DataSource): Promise<void> {
  console.log('[SEED] Starting Pokémon data seeding...');

  const filePath = path.join(__dirname, 'pokemons.json');
  const pokemonRepo = dataSource.getRepository(Pokemon);
  const typeRepo = dataSource.getRepository(PokemonType);
  const abilityRepo = dataSource.getRepository(PokemonAbility);

  await clearTables(pokemonRepo, typeRepo, abilityRepo);

  const rawData = await loadPokemonData(filePath);

  for (const pokemon of rawData) {
    const exists = await pokemonRepo.findOneBy({ id: pokemon.id });
    if (exists) {
      console.log(`[SEED] Skipping existing Pokémon: ${pokemon.name}`);
      continue;
    }

    const newPokemon = await insertPokemon(pokemonRepo, pokemon);
    await insertTypes(typeRepo, newPokemon.id, pokemon.types);
    await insertAbilities(abilityRepo, newPokemon.id, pokemon.abilities);
  }

  console.log('[SEED] Pokémon data seeding complete.');
}

// Clears all existing Pokémon-related data from the database
async function clearTables(
  pokemonRepo: Repository<Pokemon>,
  typeRepo: Repository<PokemonType>,
  abilityRepo: Repository<PokemonAbility>
): Promise<void> {
  console.log('[SEED] Clearing existing data...');
  await abilityRepo.query('DELETE FROM "pokemon_abilities"');
  await typeRepo.query('DELETE FROM "pokemon_types"');
  await pokemonRepo.query('DELETE FROM "pokemon"');
  console.log('[SEED] Database cleared.');
}

// Loads raw Pokémon data from the JSON file
async function loadPokemonData(filePath: string): Promise<RawPokemonData[]> {
  try {
    const data = await readJson(filePath);
    console.log(`[SEED] Loaded ${data.length} Pokémon from JSON.`);
    return data;
  } catch (err) {
    console.error('[SEED ERROR] Failed to load JSON:', err);
    throw err;
  }
}

// Inserts a Pokémon entity into the database
async function insertPokemon(
  repo: Repository<Pokemon>,
  data: RawPokemonData
): Promise<Pokemon> {
  const entity = repo.create({
    id: data.id,
    name: data.name,
    image_url: data.image_url,
    category: data.category,
    height: data.height,
    weight: data.weight,
  });
  const saved = await repo.save(entity);
  console.log(`[SEED] Inserted Pokémon: ${saved.name}`);
  return saved;
}

// Inserts Pokémon types into the database
async function insertTypes(
  repo: Repository<PokemonType>,
  pokemonId: string,
  types: string[]
): Promise<void> {
  const records = types.map((type, index) =>
    repo.create({ pokemon_id: pokemonId, type, slot: index + 1 })
  );
  await repo.save(records);
  console.log(`[SEED] Inserted ${records.length} types for ${pokemonId}`);
}

// Inserts Pokémon abilities into the database
async function insertAbilities(
  repo: Repository<PokemonAbility>,
  pokemonId: string,
  abilities: string[]
): Promise<void> {
  const records = abilities.map((ability) =>
    repo.create({ pokemon_id: pokemonId, ability })
  );
  await repo.save(records);
  console.log(`[SEED] Inserted ${records.length} abilities for ${pokemonId}`);
}
