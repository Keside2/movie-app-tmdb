import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../../services/tmdbApi';
import './MovieDetails.css';
import { useWatchlist } from '../../context/WatchListContext'; // Double check capitalization of 'WatchlistContext'

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();

  // FIX 1: Only check isWatched if movie exists, otherwise default to false
  const inWatchlist = movie ? isWatched(movie.id) : false;

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getMovieDetails(id);
      setMovie(data);
    };
    fetchDetails();
  }, [id]);

  if (!movie) return <div className="loading">Loading...</div>;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = movie.videos?.results?.find(v => v.type === "Trailer");

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <span>←</span>
      </button>

      {/* HERO SECTION */}
      <div 
        className="details-hero" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
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

            {/* FIX 2: Grouped Action Buttons together in a clean row */}
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
                      : 'https://via.placeholder.com/200x300?text=No+Image'} 
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