import { useState, useEffect } from 'react';
import { searchMovies } from '../../services/tmdbApi';
import MovieCard from '../../components/movie/MovieCard';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const data = await searchMovies(query);
      setResults(data);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="search-results-grid">
        {results.length > 0 ? (
          results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          query && <p className="no-results">No movies found for "{query}"</p>
        )}
      </div>
    </div>
  );
}

export default Search;