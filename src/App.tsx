import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Training from './pages/Training';
import Simulation from './pages/Simulation';
import Learning from './pages/Learning';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, checkSession } = useAuthStore();
  
  useEffect(() => {
    checkSession();
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="treinamento" element={<Training />} />
          <Route path="aprendizagem" element={<Learning />} />
          <Route path="simulacao" element={<Simulation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
