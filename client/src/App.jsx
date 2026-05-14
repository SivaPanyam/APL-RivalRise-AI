import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import TournamentArena from './pages/TournamentArena';
import Leaderboards from './pages/Leaderboards';
import FanProfile from './pages/FanProfile';
import AICoach from './pages/AICoach';
import Vault from './pages/Vault';
import Fanzone from './pages/Fanzone';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Layout or Auth Layout) */}
        <Route path="/" element={<Landing />} />
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes (Main Layout) */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/tournaments" element={<TournamentArena />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/profile" element={<FanProfile />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/fanzone" element={<Fanzone />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
