import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetails.css';
import { useWatchlist } from '../../context/WatchListContext'; 
import MovieCard from '../../components/movie/MovieCard'; 
import { getMovieDetails, getSimilarMovies } from '../../services/tmdbApi';
import MovieReviews from '../../components/movie/MovieReviews';
import toast from 'react-hot-toast';


function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  // NEW: State for the background autoplay
  const [showAutoplay, setShowAutoplay] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();

  const inWatchlist = movie ? isWatched(movie.id) : false;

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast('Removed from Watchlist', { icon: '🗑️' });
    } else {
      addToWatchlist(movie);
      toast.success('Added to Watchlist! 🍿');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const [details, similar] = await Promise.all([
        getMovieDetails(id),
        getSimilarMovies(id)
      ]);
      setMovie(details);
      setSimilarMovies(similar);
      window.scrollTo(0, 0); 

      // NEW: Trigger background autoplay after 3 seconds
      const timer = setTimeout(() => {
        setShowAutoplay(true);
      }, 3000);

      return () => clearTimeout(timer);
    };
    fetchAllData();
  }, [id]);

  if (!movie) return <div className="details-page">
      <div className="skeleton skeleton-hero"></div>
      <div className="details-content">
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '30px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
      </div>
    </div>

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = movie.videos?.results?.find(v => v.type === "Trailer");

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <span>←</span>
      </button>

      {/* HERO SECTION */}
      <div className="details-hero">
        {/* Background Image (visible while video loads) */}
        <div 
          className="hero-bg-image" 
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>

        {/* NEW: Background Autoplay Trailer */}
        {showAutoplay && trailer && (
          <div className={`hero-autoplay-container ${videoLoaded ? 'fade-in' : ''}`}>
            <iframe
              className="hero-autoplay-video"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&rel=0&showinfo=0&modestbranding=1`}
              onLoad={() => setVideoLoaded(true)}
              allow="autoplay"
              frameBorder="0"
            ></iframe>
          </div>
        )}

        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{movie.title}</h1>
            <p className="tagline">{movie.tagline}</p>
            <div className="meta">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.runtime} min</span>
              <span>{movie.release_date?.split('-')[0]}</span>
            </div>
            <p className="overview">{movie.overview}</p>
            <div className="button-group">
              {trailer && (
                <button className="play-trailer-btn" onClick={() => setShowTrailer(true)}>
                  <span className="play-icon">▶</span> Play Trailer
                </button>
              )}
              <button 
                className={`watchlist-btn ${inWatchlist ? 'active' : ''}`} 
                onClick={toggleWatchlist}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUTO-MOVING CAST SECTION */}
      <div className="details-content">
        <section className="cast-section">
          <h2>Top Cast</h2>
          <div className="cast-wrapper">
            <div className="cast-grid">
              {/* Double the list for seamless loop - showing first 20 actors */}
              {[...(movie.credits?.cast || []), ...(movie.credits?.cast || [])].slice(0, 20).map((actor, index) => (
                <div key={`${actor.id}-${index}`} className="cast-card">
                  <img 
  src={actor.profile_path 
    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(actor.name) + '&background=random&color=fff'} 
  alt={actor.name} 
/>
                  <p className="actor-name">{actor.name}</p>
                  <p className="character-name">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* NEW SIMILAR MOVIES SECTION */}
      <div className="details-content">
        {similarMovies.length > 0 && (
          <section className="similar-section">
            <h2>Similar Movies You Might Like</h2>
            <div className="movie-grid">
              {similarMovies.slice(0, 14).map(item => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <MovieReviews movieId={id} />

      {/* VIDEO MODAL POPUP */}
      {showTrailer && trailer && (
        <div className="modal-overlay" onClick={() => setShowTrailer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowTrailer(false)}>×</button>
            <div className="video-responsive">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;