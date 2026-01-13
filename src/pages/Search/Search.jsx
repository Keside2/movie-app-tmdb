import { useState, useEffect } from 'react';
import { searchMovies, getTrendingMovies } from '../../services/tmdbApi';
import MovieCard from '../../components/movie/MovieCard';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]); // Store trending suggestions
  const [loading, setLoading] = useState(false);

  // Fetch trending suggestions once when page loads
  useEffect(() => {
    const loadSuggestions = async () => {
      const data = await getTrendingMovies();
      setTrending(data || []);
    };
    loadSuggestions();
  }, []);

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
    }, 500); // 500ms is standard for search debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

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

      {loading && <div className="loader">Searching...</div>}

      {/* CASE 1: USER IS SEARCHING */}
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

      {/* CASE 2: SEARCH BAR IS EMPTY (Show Trending Suggestions) */}
      {!loading && !query && (
        <div className="search-suggestions">
          <h2 className="suggestion-title">Popular Searches 🍿</h2>
          <div className="movie-grid">
            {trending.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* CASE 3: NO RESULTS FOUND */}
      {!loading && query && results.length === 0 && (
        <div className="empty-state">
          <p>No results found for "{query}". Try something else!</p>
        </div>
      )}
    </div>
  );
}

export default Search;