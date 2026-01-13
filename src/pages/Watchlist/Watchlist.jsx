import { useWatchlist } from '../../context/WatchListContext';
import MovieCard from '../../components/movie/MovieCard';
import './Watchlist.css';

function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container">
      <h1 className="page-title">My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="empty-state">
          <p>Your watchlist is empty. Start adding some movies!</p>
        </div>
      ) : (
        <div className="movie-grid">
          {watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;