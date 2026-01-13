import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Navbar from './components/layout/Navbar';
import MovieDetails from './pages/MovieDetails/MovieDetails'; // Import the new page
import { WatchlistProvider } from './context/WatchListContext';
import Watchlist from './pages/Watchlist/Watchlist';
import Auth from './pages/Auth/Auth';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
    <WatchlistProvider>
    <Router>
      <Navbar /> {/* This stays visible on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/login" element={<Auth />} />
        {/* Public Route */}
  <Route path="/login" element={<Auth />} />

  {/* Protected Routes */}
  <Route path="/" element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } />

  <Route path="/search" element={
    <ProtectedRoute>
      <Search />
    </ProtectedRoute>
  } />

  <Route path="/watchlist" element={
    <ProtectedRoute>
      <Watchlist />
    </ProtectedRoute>
  } />

  <Route path="/movie/:id" element={
    <ProtectedRoute>
      <MovieDetails />
    </ProtectedRoute>
  } />

        <Route 
  path="/watchlist" 
  element={
    <ProtectedRoute>
      <Watchlist />
    </ProtectedRoute>
  } 
/>
      </Routes>
    </Router>
    </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;