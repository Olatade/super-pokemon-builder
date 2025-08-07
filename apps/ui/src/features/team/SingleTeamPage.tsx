import { useParams } from 'react-router-dom';
import { PokemonList, SinglePokemon } from '../pokemon/PokemonList';
import { useAppSelector } from '../withTypes';
import { addPokemonToTeam, selectTeamById } from './teamSlice';
import { SingleTeam } from './TeamList';
import { selectAllPokemon } from '../pokemon/pokemonSlice';
import { useAppDispatch } from '../withTypes';

export const SingleTeamPage = () => {
  const { teamId } = useParams();
  const dispatch = useAppDispatch();

  const team = useAppSelector((state) => selectTeamById(state, teamId || ''));
  const pokemons = useAppSelector((state) => selectAllPokemon(state));

  const handleAddPokemon = (pokemonId: string) => {
    if (teamId) {
      dispatch(addPokemonToTeam({ teamId, pokemonId }));
    }
  };

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div>
      <div className="flex border border-yellow-500">
        <div className="w-1/2">
          <SingleTeam teamId={team.id} />
        </div>
        <div className="w-1/2 h-screen over overflow-scroll">
          <h3>Pokemons</h3>
          {pokemons.map((pokemon) => (
            <div className=" flex items-center border border-red-500 rounded-md">
              <SinglePokemon pokemon={pokemon} />
              <button onClick={() => handleAddPokemon(pokemon.id)}>
                Add to team
              </button>
            </div>
          ))}
          {/* <PokemonList /> */}
        </div>
      </div>
    </div>
  );
};
