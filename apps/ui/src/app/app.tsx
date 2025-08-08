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
import { HomePage } from '../features/team/TeamsMainPage';
import { ManageTeamPage } from '../features/team/ManageTeamPage';
import { CreateProfilePage } from '../features/auth/CreateProfile';

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
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/teams/:teamId" element={<ManageTeamPage />} />
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
