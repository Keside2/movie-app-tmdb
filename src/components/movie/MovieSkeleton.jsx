import './MovieSkeleton.css';

const MovieSkeleton = () => {
  return (
    <div className="movie-card-skeleton">
      <div className="skeleton skeleton-card"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  );
};

export default MovieSkeleton;