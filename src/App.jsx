import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Navbar from './components/layout/Navbar';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import { WatchlistProvider } from './context/WatchListContext';
import Watchlist from './pages/Watchlist/Watchlist';
import Auth from './pages/Auth/Auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <Navbar /> 
          <Routes>
            {/* 1. PUBLIC ROUTE - Anyone can see this */}
            <Route path="/login" element={<Auth />} />

            {/* 2. PROTECTED ROUTES - Only logged-in users */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/movie/:id" 
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all: If user goes to a wrong URL, send them home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;