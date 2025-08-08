import { Link } from 'react-router-dom';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../withTypes';
import {
  fetchTeams,
  removePokemonFromTeam,
  selectTeamById,
  selectTeamIds,
  selectTeamsError,
  selectTeamsStatus,
} from './teamSlice';
import { useEffect } from 'react';
import { Spinner } from '../../components/Spinner';
import { Pokemon } from '@super-pokemon-builder/shared/data-models';

interface singleTeamProps {
  teamId: string;
}

interface RemovablePokemonProps {
  pokemon: Pokemon;
  teamId: string;
}

const RemovablePokemon = ({ pokemon, teamId }: RemovablePokemonProps) => {
  const dispatch = useAppDispatch();
  // const handleRemovePokemonFromTeam = (pokemonId: string, teamId: string) => {
  //   dispatch(removePokemonFromTeam({ teamId, pokemonId }));
  // };

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-0 bg-gray-200  px-2 py-2">
      <div className="flex items-center gap-x-3  ">
        <div>
          <img
            src={pokemon.image_url}
            alt={pokemon.name || ''}
            className="h-12"
          ></img>
        </div>
        <div>
          <h2 className="text-sm">{pokemon.name}</h2>
          <div className="flex gap-x-4">
            <p className="text-xs">{pokemon.category}</p>
            <p className="text-xs">weight: {pokemon.weight}</p>
            <p className="text-xs">height: {pokemon.height}</p>
          </div>
        </div>
      </div>

      {/* <button
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          handleRemovePokemonFromTeam(pokemon.id, teamId);
        }}
        className="text-xs border "
      >
        Remove {pokemon.name}
      </button> */}
    </div>
  );
};

export const DisplaySingleTeam = ({ teamId }: singleTeamProps) => {
  const team = useAppSelector((state) => selectTeamById(state, teamId));
  return (
    <Link
      to={`/teams/${team.id}`}
      className="border border-gray-300 bg-gray-50 rounded-lg shadow-sm px-3 py-3 cursor-pointer hover:bg-gray-100 text-inherit no-underline hover:no-underline"
    >
      <h3 className="text-lg text-blue-700 ">{team.name}</h3>
      <div className="flex flex-col gap-y-2">
        {team.teamPokemon && team.teamPokemon.length > 0 ? (
          team.teamPokemon.map((pokemon) => {
            return (
              <div key={pokemon.pokemon_id}>
                <RemovablePokemon pokemon={pokemon.pokemon} teamId={teamId} />
              </div>
            );
          })
        ) : (
          <div className="text-xs">
            You don't have any pokemons in this team
          </div>
        )}
      </div>
    </Link>
  );
};

export const TeamsList = () => {
  const dispatch = useAppDispatch();
  const teamIds = useAppSelector(selectTeamIds);
  const teamsStatus = useAppSelector(selectTeamsStatus);
  const teamsError = useAppSelector(selectTeamsError);

  useEffect(() => {
    if (teamsStatus === 'idle') {
      dispatch(fetchTeams());
    }
  }, [teamsStatus, dispatch]);

  let content: React.ReactNode;
  if (teamsStatus === 'pending') {
    content = <Spinner text="Loading..." />;
  } else if (teamsStatus === 'succeeded') {
    content = teamIds.map((teamId) => (
      <DisplaySingleTeam key={teamId} teamId={teamId} />
    ));
  } else if (teamsStatus === 'rejected') {
    content = <div>{teamsError}</div>;
  }

  return (
    <section className=" border border-gray-500 rounded-lg ">
      <h2>Your teams</h2>
      <div className="flex flex-col gap-y-4">{content}</div>
    </section>
  );
};
