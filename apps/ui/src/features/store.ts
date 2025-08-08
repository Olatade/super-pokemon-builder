import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from '../features/auth/authSlice';
import teamsReducer from '../features/team/teamSlice';
import pokemonsReducer from '../features/pokemon/pokemonSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  teams: teamsReducer,
  pokemons: pokemonsReducer,
});

const rootReducer: typeof combinedReducer = (state, action) => {
  if (action.type === logout.type) {
    // Reset the entire state to undefined, which will cause configureStore to use the initial state
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>;
// Export a reusable type for handwritten thunks
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
