import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCarousel.css';

function FeaturedCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredMovies = movies.slice(0, 5); // Take the top 5 trending

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change movie every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="featured-carousel">
      <div 
        className="carousel-slide"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})` }}
      >
        <div className="carousel-overlay">
          <div className="carousel-content">
            <h1>{currentMovie.title}</h1>
            <p>{currentMovie.overview.substring(0, 150)}...</p>
            <Link to={`/movie/${currentMovie.id}`} className="play-btn">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;