import { CreateTeamForm } from './CreateTeamForm';
import { TeamsList } from './TeamList';

export function HomePage() {
  return (
    <div>
      <CreateTeamForm />
      <TeamsList />
    </div>
  );
}
