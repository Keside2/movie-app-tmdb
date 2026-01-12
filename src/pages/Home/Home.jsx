import { useEffect, useState } from 'react';
import { getTrendingMovies } from '../../services/tmdbApi';

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await getTrendingMovies();
      setMovies(data);
    };
    loadMovies();
  }, []);

  return (
    <div className="home-container">
      <h1>Trending Today</h1>
      <div className="movie-grid">
        {movies.map(movie => (
          <p key={movie.id}>{movie.title}</p> 
          /* Later, replace <p> with your MovieCard component */
        ))}
      </div>
    </div>
  );
}

export default Home;