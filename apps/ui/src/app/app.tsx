import { Navbar } from '../components/Navbar';
import { LoginPage } from '../features/auth/LoginPage';

import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import { useAppSelector } from '../features/withTypes';
import { selectCurrentUsername } from '../features/auth/authSlice';
import { TeamsMainPage } from '../features/team/TeamsMainPage';
import { SingleTeamPage } from '../features/team/SingleTeamPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername);

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/teams" element={<TeamsMainPage />} />
                  <Route path="/teams/:teamId" element={<SingleTeamPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
