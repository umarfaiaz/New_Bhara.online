
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MySpace from './pages/MySpace';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import Home from './pages/Home';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './contexts/LanguageContext';

// Helper to check auth status directly from storage for initial state
const checkAuth = () => localStorage.getItem('bhara_auth') === 'true';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth);

  const handleLogin = () => {
    localStorage.setItem('bhara_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bhara_auth');
    setIsAuthenticated(false);
  };

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans">
            <Routes>
              {/* Auth Routes (Redirect to dashboard if already logged in) */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/myspace/overview" /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/myspace/overview" /> : <Register onLogin={handleLogin} />} />
              
              {/* Protected Routes: MySpace, Profile, Inbox */}
              <Route path="/myspace/*" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <MySpace />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                   <Layout onLogout={handleLogout}>
                    <Profile onLogout={handleLogout} />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/inbox/*" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                   <Layout onLogout={handleLogout}>
                     <Inbox />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Public Routes: Marketplace, Home */}
              <Route path="/marketplace/*" element={
                 <Layout onLogout={handleLogout}>
                  <Marketplace />
                </Layout>
              } />
              
              <Route path="/home" element={
                 <Layout onLogout={handleLogout}>
                  <Home />
                </Layout>
              } />
              
              {/* Redirects */}
              <Route path="/tolet" element={<Navigate to="/marketplace" />} />
              <Route path="/" element={<Navigate to={isAuthenticated ? "/myspace/overview" : "/home"} />} />
            </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
