import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../withTypes';
import { useEffect } from 'react';
import { Spinner } from '../../components/Spinner';
import {
  fetchAllPokemons,
  selectAllPokemon,
  selectPokemonIds,
  selectPokemonsError,
  selectPokemonsStatus,
} from './pokemonSlice';
import { Pokemon } from '@super-pokemon-builder/shared/data-models';
import { addPokemonToTeam } from '../team/teamSlice';

interface singleTeamProps {
  pokemon: Pokemon;
  teamId?: string;
}

export const SinglePokemon = ({ pokemon, teamId = '' }: singleTeamProps) => {
  const dispatch = useAppDispatch();
  const handleRemovePokemonFromTeam = (pokemonId: string, teamId: string) => {
    dispatch(addPokemonToTeam({ teamId, pokemonId }));
  };

  return (
    <div className="post-excerpt w-full" key={pokemon.id}>
      <h3>
        <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
      </h3>
      <div>
        <p>{pokemon.name}</p>
      </div>
      {teamId ? (
        <button onClick={() => handleRemovePokemonFromTeam(pokemon.id, teamId)}>
          Add to team
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
      <div className="flex items-center border border-blue-600">
        <SinglePokemon key={pokemon.id} pokemon={pokemon} />
        {teamId ? (
          <button onClick={() => handleAddPokemonToTeam(pokemon.id, teamId)}>
            Add to team
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
    <section className="border border-red-500">
      <h2>Pokemons</h2>
      <div>{content}</div>
    </section>
  );
};
