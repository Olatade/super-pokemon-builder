import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../withTypes';
import { useEffect } from 'react';
import { Spinner } from '../../components/Spinner';
import {
  fetchAllPokemons,
  selectAllPokemon,
  selectPokemonsError,
  selectPokemonsStatus,
} from './pokemonSlice';
import { Pokemon } from '@super-pokemon-builder/shared/data-models';
import { addPokemonToTeam, removePokemonFromTeam } from '../team/teamSlice';

interface singleTeamProps {
  pokemon: Pokemon;
  teamId?: string;
}

export const SinglePokemon = ({ pokemon, teamId = '' }: singleTeamProps) => {
  const dispatch = useAppDispatch();

  const handleRemovePokemonFromTeam = (pokemonId: string, teamId: string) => {
    dispatch(removePokemonFromTeam({ teamId, pokemonId }));
  };

  return (
    <div className="flex items-center flex-row gap-x-4" key={pokemon.id}>
      <div className="">
        <img
          src={pokemon.image_url}
          alt={pokemon.name || ''}
          className="max-w-24 object-contain"
        ></img>
      </div>

      <div className="flex flex-col">
        <p className="text-lg font-bold">{pokemon.name}</p>
        <div className="flex flex-row gap-x-2 text-xs">
          <p className="text-sm">category: {pokemon.category}</p>
          <p className="text-sm">weight: {pokemon.weight}</p>
          <p className="text-sm">height: {pokemon.height}</p>
        </div>
      </div>

      {teamId ? (
        <button onClick={() => handleRemovePokemonFromTeam(pokemon.id, teamId)}>
          Remove from team
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export const PokemonList = ({ teamId = '' }) => {
  const dispatch = useAppDispatch();
  const pokemons = useAppSelector(selectAllPokemon);
  const pokemonsStatus = useAppSelector(selectPokemonsStatus);
  const pokemonsError = useAppSelector(selectPokemonsError);

  const handleAddPokemonToTeam = (pokemonId: string, teamId: string) => {
    dispatch(addPokemonToTeam({ teamId, pokemonId }));
  };

  useEffect(() => {
    if (pokemonsStatus === 'idle') {
      dispatch(fetchAllPokemons());
    }
  }, [pokemonsStatus, dispatch]);

  let content: React.ReactNode;

  if (pokemonsStatus === 'pending') {
    content = <Spinner text="Loading..." />;
  } else if (pokemonsStatus === 'succeeded') {
    content = pokemons.map((pokemon) => (
      <div
        key={pokemon.id}
        className="flex justify-between rounded-lg  bg-blue-100"
      >
        <SinglePokemon pokemon={pokemon} />
        {teamId ? (
          <button onClick={() => handleAddPokemonToTeam(pokemon.id, teamId)}>
            Add
          </button>
        ) : (
          ''
        )}
      </div>
    ));
  } else if (pokemonsStatus === 'rejected') {
    content = <div>{pokemonsError}</div>;
  }

  return (
    <section className="border">
      <h2>Pokemons</h2>
      <div className="flex flex-col gap-y-2">{content}</div>
    </section>
  );
};
