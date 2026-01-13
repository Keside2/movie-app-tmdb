import MovieCard from './MovieCard';
import './MovieRow.css';

function MovieRow({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-row-container">
      <h2 className="row-title">{title}</h2>
      <div className="movie-row-scroll">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-row-item">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieRow;