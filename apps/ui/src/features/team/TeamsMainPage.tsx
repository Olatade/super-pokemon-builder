import { CreateTeamForm } from './CreateTeamForm';
import { TeamsList } from './TeamList';

export function TeamsMainPage() {
  return (
    <div>
      <CreateTeamForm />
      <TeamsList />
    </div>
  );
}
