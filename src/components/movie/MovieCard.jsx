// src/components/movie/MovieCard.jsx
import './MovieCard.css';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
       <div className="movie-card">
      <div className="movie-poster">
        <img src={imageUrl} alt={movie.title} loading="lazy" />
        {/* <div className="movie-overlay">
           <button className="favorite-btn">❤️</button>
        </div> */}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>
          <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
          {" • "} 
          {movie.release_date?.split('-')[0]}
        </p>
      </div>
    </div>
    </Link>
  );
}

export default MovieCard;