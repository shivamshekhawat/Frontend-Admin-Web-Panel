import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import Hotels from './components/Hotels';
import Dashboard from './components/Dashboard';
import RoomsManagement from './components/RoomsManagement';
import GuestManagement from './components/GuestManagement';
import Notifications from './components/Notifications';
import Feedback from './components/Feedback';
import Settings from './components/Settings';
import Calendar from './components/Calendar';
import Layout from './components/Layout';
import ConfigureDisplay from './components/ConfigureDisplay';
import Users from './components/Users';
import CleanRequests from './components/CleanRequests';
import TechnicalIssues from './components/TechnicalIssues';
import Reservations from './components/Reservations';
import { ThemeProvider } from './lib/ThemeContext';
import { adminApi } from './services/api';
import { checkAdminHotels } from './services/hotelService';

export interface User {
  username: string;
  email: string;
  role: string;
  accessScope: string;
}

// ✅ ProtectedRoute
const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children: JSX.Element }) => {
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return children;
};

// ✅ AppWrapper
const AppWrapper = () => (
  <ThemeProvider>
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
  </Router>
  </ThemeProvider>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Clear all authentication and start fresh from login
  useEffect(() => {
    const clearAuthAndStart = () => {
      try {
        // Clear all authentication data
        localStorage.clear();
        sessionStorage.clear();
        adminApi.clearToken();
        
        // Reset state
        setIsAuthenticated(false);
        setCurrentUser(null);
        setHotelId(null);
        
        console.log('🔐 Cleared all authentication data - starting fresh');
      } catch (error) {
        console.error('Error clearing authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    clearAuthAndStart();
  }, []);

  const handleLogin = async (user: User) => {
    console.log('🔐 Handling login for user:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Show loading while checking hotels
    setIsLoading(true);
    
    try {
      console.log('🏨 Checking admin hotels after login...');
      const hotelCheck = await checkAdminHotels();
      console.log('🏨 Hotel check result:', hotelCheck);
      
      if (hotelCheck.hasHotel && hotelCheck.selectedHotel) {
        setHotelId(hotelCheck.selectedHotel.id);
        console.log('🏨 Redirecting to hotel dashboard:', hotelCheck.selectedHotel.id);
      } else {
        console.log('🏨 No hotel found, redirecting to create hotel');
      }
      
      // Navigate to the determined path
      navigate(hotelCheck.redirectPath, { replace: true });
      
    } catch (error) {
      console.error('🏨 Error during login hotel check:', error);
      // On error, redirect to create hotel as fallback
      navigate('/create-hotel', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    // Clear persisted auth token and admin info
    adminApi.clearToken();
    navigate('/sign-in', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Setting up your account</h3>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we check your hotel configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/sign-in"
        element={<LoginScreen onLogin={handleLogin} />}
      />

      {/* Root "/" route */}
      <Route path="/" element={<Navigate to="/sign-in" replace />} />

      {/* Create Hotel Route */}
      <Route
        path="/create-hotel"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Hotels />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes wrapped with Layout */}
      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout currentUser={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="/hotel/:hotelId/dashboard" element={<Dashboard />} />
        <Route path="/hotel/:hotelId/rooms" element={<RoomsManagement />} />
        <Route path="/hotel/:hotelId/guests" element={<GuestManagement />} />
        <Route path="/hotel/:hotelId/notifications" element={<Notifications />} />
        <Route path="/hotel/:hotelId/feedback" element={<Feedback />} />
        <Route path="/hotel/:hotelId/settings" element={<Settings />} />
        <Route path="/hotel/:hotelId/configure-display" element={<ConfigureDisplay />} />
        <Route path="/hotel/:hotelId/calendar" element={<Calendar />} />
        <Route path="/hotel/:hotelId/users" element={<Users />} />
        <Route path="/hotel/:hotelId/clean-requests" element={<CleanRequests />} />
        <Route path="/hotel/:hotelId/technical-issues" element={<TechnicalIssues />} />
        <Route path="/hotel/:hotelId/reservations" element={<Reservations />} />
      </Route>

      {/* Catch-all: redirect unauthenticated users to login */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/create-hotel" : "/sign-in"} replace />} />
    </Routes>
  );
};


export default AppWrapper;
