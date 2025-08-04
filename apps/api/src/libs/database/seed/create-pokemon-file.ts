import axios from 'axios';
import { writeJson, pathExists, readJson } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// -----------------------------
// Types for API responses
// -----------------------------
type Language = { name: string };
type Genus = { genus: string; language: Language };

interface PokemonAPIResponse {
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      ['official-artwork']: {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

interface PokemonSpeciesAPIResponse {
  genera: Genus[];
}

// -----------------------------
// Final structured Pokémon object type
// -----------------------------
interface PokemonData {
  id: string;
  name: string;
  image_url: string;
  category: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
}

// -----------------------------
// Utility: Get Pokémon category (genus in English)
// -----------------------------
async function getPokemonCategory(idOrName: number | string): Promise<string> {
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${idOrName}`;
  const { data } = await axios.get<PokemonSpeciesAPIResponse>(speciesUrl);
  const englishGenus = data.genera.find((g) => g.language.name === 'en');
  return englishGenus?.genus ?? 'Unknown';
}

// -----------------------------
// Utility: Build Pokémon data
// -----------------------------
async function buildPokemonData(id: number): Promise<PokemonData> {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const { data } = await axios.get<PokemonAPIResponse>(pokemonUrl);

  return {
    id: uuidv4(),
    name: data.name,
    image_url: data.sprites.other['official-artwork'].front_default,
    category: await getPokemonCategory(id),
    height: data.height * 10, // convert decimeters to cm
    weight: data.weight / 10, // convert hectograms to kg
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
  };
}

// -----------------------------
// Utility: Check if data already exists
// -----------------------------
async function shouldFetchData(outputFilePath: string): Promise<boolean> {
  if (!(await pathExists(outputFilePath))) return true;
  const existingData = await readJson(outputFilePath);
  return !Array.isArray(existingData) || existingData.length === 0;
}

// -----------------------------
// Core function: Fetch and save Pokémon data
// -----------------------------
export async function fetchAndSavePokemons(count = 150): Promise<void> {
  const outputFile = path.join(__dirname, 'pokemons.json');

  console.log(`[INIT] Starting Pokémon data fetch for ${count} Pokémon...`);

  const shouldFetch = await shouldFetchData(outputFile);
  if (!shouldFetch) {
    console.log(`[SKIP] pokemons.json already exists and contains data.`);
    return;
  }

  const results: PokemonData[] = [];

  for (let i = 1; i <= count; i++) {
    try {
      console.log(`[FETCH] Processing Pokémon #${i}...`);
      const pokemon = await buildPokemonData(i);
      results.push(pokemon);
    } catch (error) {
      console.error(
        `[ERROR] Failed to fetch Pokémon #${i}:`,
        error.message || error
      );
    }
  }

  await writeJson(outputFile, results, { spaces: 2 });

  console.log(
    `[DONE] Successfully saved ${results.length} Pokémon to pokemons.json`
  );
}
