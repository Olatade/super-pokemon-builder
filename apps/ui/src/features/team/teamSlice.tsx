import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { createAppAsyncThunk } from '../withTypes';
import { Team } from '@super-pokemon-builder/shared/data-models';
import { apiHome, authHeader } from '../auth/authSlice';
import { RootState } from '../store';

export const fetchTeams = createAppAsyncThunk(
  'teams/fetchMy',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { username, password } = getState().auth;
      const response = await axios.get(
        `${apiHome}/team`,
        authHeader(username, password)
      );
      return response.data;
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      // Use rejectWithValue to pass the error to the rejected action
      return rejectWithValue(
        err.response?.data || err.message || 'Failed to fetch teams'
      );
    }
  },
  {
    condition(arg, thunkApi) {
      const teamsStatus = selectTeamsStatus(thunkApi.getState());
      if (teamsStatus !== 'idle') {
        return false;
      }
    },
  }
);

export const createTeam = createAppAsyncThunk<
  Team,
  { name: string; profile_id?: string }
>('teams/create', async (payload, { getState }) => {
  const { username, password } = getState().auth;
  const response = await axios.post(
    `${apiHome}/team`,
    payload,
    authHeader(username, password)
  );
  return response.data;
});

export const deleteTeam = createAppAsyncThunk<string, string>(
  'teams/delete',
  async (teamId, { getState }) => {
    const { username, password } = getState().auth;
    await axios.delete(
      `${apiHome}/team/${teamId}`,
      authHeader(username, password)
    );
    return teamId;
  }
);

export const deleteTeamPokemon = createAppAsyncThunk<
  { teamId: string; pokemonId: string },
  { teamId: string; pokemonId: string }
>('teams/deletePokemon', async ({ teamId, pokemonId }, { getState }) => {
  const { username, password } = getState().auth;
  await axios.delete(
    `${apiHome}/team/${teamId}/pokemon/${pokemonId}`,
    authHeader(username, password)
  );
  return { teamId, pokemonId };
});

export const removePokemonFromTeam = createAppAsyncThunk<
  { teamId: string; pokemonId: string },
  { teamId: string; pokemonId: string }
>('teams/removePokemon', async ({ teamId, pokemonId }, { getState }) => {
  const { username, password } = getState().auth;
  await axios.delete(
    `${apiHome}/team/${teamId}/pokemon/${pokemonId}`,
    authHeader(username, password)
  );
  return { teamId, pokemonId };
});

export const addPokemonToTeam = createAppAsyncThunk<
  Team,
  { teamId: string; pokemonId: string }
>('teams/addPokemon', async ({ teamId, pokemonId }, { getState }) => {
  const { username, password } = getState().auth;
  const response = await axios.post(
    `${apiHome}/team/${teamId}/pokemon`,
    { pokemon_id: pokemonId },
    authHeader(username, password)
  );
  return response.data;
});

interface TeamState extends EntityState<Team, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'rejected';
  error: string | null;
}

const teamsAdapter = createEntityAdapter<Team>({
  sortComparer: (a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
});

const initialState: TeamState = teamsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    reset: (state) => teamsAdapter.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        teamsAdapter.setAll(state, action.payload.data);
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = 'rejected';
        state.error =
          action.error.message ||
          (action.payload as any)?.message ||
          'Unknown Error';
        console.error('fetchTeams rejected with error:', action.error);
        if (action.payload) {
          console.error('fetchTeams rejected payload:', action.payload);
        }
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        teamsAdapter.addOne(state, action.payload);
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        teamsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteTeamPokemon.fulfilled, (state, action) => {
        const { teamId, pokemonId } = action.payload;
        teamsAdapter.updateOne(state, {
          id: teamId,
          changes: {
            teamPokemon: state.entities[teamId]?.teamPokemon?.filter(
              (pokemon) => pokemon.pokemon_id !== pokemonId
            ),
          },
        });
      })
      .addCase(removePokemonFromTeam.fulfilled, (state, action) => {
        const { teamId, pokemonId } = action.payload;
        teamsAdapter.updateOne(state, {
          id: teamId,
          changes: {
            teamPokemon: state.entities[teamId]?.teamPokemon?.filter(
              (pokemon) => pokemon.pokemon_id !== pokemonId
            ),
          },
        });
      })
      .addCase(addPokemonToTeam.fulfilled, (state, action) => {
        teamsAdapter.upsertOne(state, action.payload);
      });
  },
});

export default teamsSlice.reducer;

export const {
  selectAll: selectAllTeams,
  selectById: selectTeamById,
  selectIds: selectTeamIds,
} = teamsAdapter.getSelectors((state: RootState) => state.teams);

export const selectTeamsStatus = (state: RootState) => state.teams.status;
export const selectTeamsError = (state: RootState) => state.teams.error;
