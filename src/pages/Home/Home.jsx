import { useEffect, useState } from 'react';
import { getTrendingMovies, getTopMoviesNigeria, getMoviesByGenre } from '../../services/tmdbApi';
import { useWatchlist } from '../../context/WatchListContext';
import FeaturedCarousel from '../../components/movie/FeaturedCarousel';
import MovieRow from '../../components/movie/MovieRow';
import MovieCard from '../../components/movie/MovieCard';
import GenreFilter from '../../components/movie/GenreFilter';

function Home() {
  const [trending, setTrending] = useState([]);
  const [topNigeria, setTopNigeria] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 = Home/Trending
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const loadData = async () => {
      if (selectedGenre === 0) {
        // Load Home Page Rows
        const [trendingData, nigeriaData] = await Promise.all([
          getTrendingMovies(),
          getTopMoviesNigeria()
        ]);
        setTrending(trendingData);
        setTopNigeria(nigeriaData);
      } else {
        // Load Specific Genre Grid
        const data = await getMoviesByGenre(selectedGenre);
        setGenreMovies(data);
      }
    };
    loadData();
  }, [selectedGenre]);

  return (
    <div className="home-page">
      {/* 1. Show Carousel ONLY on the Home/Trending view */}
      {selectedGenre === 0 && <FeaturedCarousel movies={trending} />}

      <div className="container">
        <header className="home-header">
          <h1 className="page-title">
            {selectedGenre === 0 ? "Browse" : "Discover"}
          </h1>
          <GenreFilter 
            selectedGenre={selectedGenre} 
            setSelectedGenre={setSelectedGenre} 
          />
        </header>

        {/* 2. CONDITIONAL RENDERING */}
        {selectedGenre === 0 ? (
          /* HOME VIEW: Horizontal Rows */
          <div className="home-rows">
            {watchlist.length > 0 && (
              <MovieRow title="My Watchlist" movies={watchlist} />
            )}
            <MovieRow title="Top 10 in Nigeria Today 🇳🇬" movies={topNigeria} />
            <MovieRow title="Trending Worldwide" movies={trending} />
          </div>
        ) : (
          /* GENRE VIEW: Responsive Grid */
          <div className="movie-grid">
            {genreMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} /> 
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;