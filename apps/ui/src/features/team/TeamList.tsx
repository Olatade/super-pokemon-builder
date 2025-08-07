import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../withTypes';
import {
  fetchTeams,
  selectTeamById,
  selectTeamIds,
  selectTeamsError,
  selectTeamsStatus,
} from './teamSlice';
import { useEffect } from 'react';
import { Spinner } from '../../components/Spinner';

interface singleTeamProps {
  teamId: string;
}

export const SingleTeam = ({ teamId }: singleTeamProps) => {
  const team = useAppSelector((state) => selectTeamById(state, teamId));
  return (
    <div className="border border-red-500 ">
      <h3>
        <Link to={`/teams/${team.id}`}>{team.name}</Link>
      </h3>
      <div>
        {team.teamPokemon?.map((pokemon) => {
          return <p>{pokemon.pokemon.name}</p>;
        })}
      </div>
    </div>
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
      <SingleTeam key={teamId} teamId={teamId} />
    ));
  } else if (teamsStatus === 'rejected') {
    content = <div>{teamsError}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Your teams</h2>
      {content}
    </section>
  );
};
