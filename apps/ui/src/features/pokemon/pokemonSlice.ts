import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { Pokemon } from '@super-pokemon-builder/shared/data-models';
import { RootState } from '../store';
import { apiHome, authHeader } from '../auth/authSlice';
import { createAppAsyncThunk } from '../withTypes';

export const fetchAllPokemons = createAppAsyncThunk(
  'pokemon/fetchAll',
  async (_, { getState }) => {
    const { username, password } = getState().auth;
    const response = await axios.get(
      `${apiHome}/pokemon`,
      authHeader(username, password)
    );
    return response.data.data;
  }
);

const pokemonAdapter = createEntityAdapter<Pokemon>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState: PokemonState = pokemonAdapter.getInitialState({
  status: 'idle',
  error: null,
});

interface PokemonState extends EntityState<Pokemon, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'rejected';
  error: string | null;
}

export const pokemonSlice = createSlice({
  name: 'pokemons',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPokemons.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchAllPokemons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        pokemonAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAllPokemons.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || null;
      });
  },
});

export default pokemonSlice.reducer;

export const selectPokemonsStatus = (state: RootState) => state.pokemons.status;
export const selectPokemonsError = (state: RootState) => state.pokemons.error;

export const {
  selectAll: selectAllPokemon,
  selectById: selectPokemonById,
  selectIds: selectPokemonIds,
} = pokemonAdapter.getSelectors((state: RootState) => state.pokemons);
