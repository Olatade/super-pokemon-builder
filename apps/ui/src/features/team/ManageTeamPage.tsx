import { Link, useParams } from 'react-router-dom';
import { PokemonList } from '../pokemon/PokemonList';
import { useAppDispatch, useAppSelector } from '../withTypes';
import { removePokemonFromTeam, selectTeamById } from './teamSlice';
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
  const handleRemovePokemonFromTeam = (pokemonId: string, teamId: string) => {
    dispatch(removePokemonFromTeam({ teamId, pokemonId }));
  };

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

      <button
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          handleRemovePokemonFromTeam(pokemon.id, teamId);
        }}
        className="text-xs border "
      >
        Remove {pokemon.name}
      </button>
    </div>
  );
};

const ManageSingleTeam = ({ teamId }: singleTeamProps) => {
  const team = useAppSelector((state) => selectTeamById(state, teamId));
  return (
    <div className="border border-gray-300 bg-gray-50 rounded-lg shadow-sm px-3 py-3 cursor-pointer hover:bg-gray-100 text-inherit no-underline hover:no-underline mt-12">
      <h3 className="text-lg text-blue-700 ">Manage {team.name}</h3>
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
    </div>
  );
};

export const ManageTeamPage = () => {
  const { teamId } = useParams();

  const team = useAppSelector((state) => selectTeamById(state, teamId || ''));

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div>
      <div className="flex flex-row border border-yellow-500">
        <div className="w-1/2 px-6">
          <ManageSingleTeam teamId={team.id} />
        </div>
        <div className="w-1/2 h-screen over overflow-scroll">
          <PokemonList teamId={team.id} />
        </div>
      </div>
    </div>
  );
};
