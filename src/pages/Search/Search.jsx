import { useState, useEffect } from 'react';
import { searchMovies, getTrendingMovies } from '../../services/tmdbApi';
import MovieCard from '../../components/movie/MovieCard';
import MovieSkeleton from '../../components/movie/MovieSkeleton'; // Import Skeleton
import './Search.css';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [history, setHistory] = useState([]); // Store local history
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 1. Fetch Trending & User Search History on load
  useEffect(() => {
    const loadInitialData = async () => {
      const trendingData = await getTrendingMovies();
      setTrending(trendingData || []);

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setHistory(userDoc.data().searchHistory || []);
        }
      }
    };
    loadInitialData();
  }, [user]);

  // 2. Debounced Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data || []);
      setLoading(false);

      // Save to History in Firestore if results found
      if (user && data?.length > 0) {
        saveSearchToFirebase(query);
      }
    }, 600); 

    return () => clearTimeout(delayDebounceFn);
  }, [query, user]);

  const saveSearchToFirebase = async (searchTerm) => {
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        searchHistory: arrayUnion(searchTerm.toLowerCase())
      });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  return (
    <div className="container search-page">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* CASE 1: LOADING SKELETONS */}
      {loading && (
        <div className="search-results">
          <h2>Searching for "{query}"...</h2>
          <div className="movie-grid">
            {[...Array(8)].map((_, i) => <MovieSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* CASE 2: SEARCH RESULTS FOUND */}
      {!loading && query && results.length > 0 && (
        <div className="search-results">
          <h2>Results for "{query}"</h2>
          <div className="movie-grid">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* CASE 3: EMPTY SEARCH BAR (Show History & Trending) */}
      {!loading && !query && (
        <div className="search-suggestions">
          {history.length > 0 && (
            <div className="history-section">
              <h3>Recent Searches</h3>
              <div className="history-chips">
                {history.slice(-5).reverse().map((term, i) => (
                  <span key={i} className="history-chip" onClick={() => setQuery(term)}>
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <h2 className="suggestion-title">Popular Searches 🍿</h2>
          <div className="movie-grid">
            {trending.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* CASE 4: NO RESULTS */}
      {!loading && query && results.length === 0 && (
        <div className="empty-state">
          <p>No results found for "{query}". Try something else!</p>
        </div>
      )}
    </div>
  );
}

export default Search;