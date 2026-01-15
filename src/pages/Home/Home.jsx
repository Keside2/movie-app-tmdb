import { useEffect, useState } from 'react';
import { getTrendingMovies, getTopMoviesNigeria, getMoviesByGenre } from '../../services/tmdbApi';
import { useWatchlist } from '../../context/WatchListContext';
import { useAuth } from '../../context/AuthContext'; // 1. Import Auth
import { db } from '../../services/firebase'; // 2. Import Firestore
import { doc, getDoc } from 'firebase/firestore'; 
import FeaturedCarousel from '../../components/movie/FeaturedCarousel';
import MovieRow from '../../components/movie/MovieRow';
import MovieCard from '../../components/movie/MovieCard';
import GenreFilter from '../../components/movie/GenreFilter';
import GenrePicker from '../../components/Onboarding/GenrePicker'; // 3. Import Picker
import MovieSkeleton from '../../components/movie/MovieSkeleton';


function Home() {
  const [trending, setTrending] = useState([]);
  const [topNigeria, setTopNigeria] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(0); 
  const [showOnboarding, setShowOnboarding] = useState(false); // 4. Onboarding state
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { watchlist } = useWatchlist();
  const { user } = useAuth(); // 5. Get current user

  // 6. Check if user has finished onboarding
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      if (!user) {
         // Load general data even if no user
         const [trendingData, nigeriaData] = await Promise.all([
          getTrendingMovies(),
          getTopMoviesNigeria()
        ]);
        setTrending(trendingData);
        setTopNigeria(nigeriaData);
        setLoading(false);
        return;
      }

      try {
        // Fetch User Data and General Data in parallel for speed
        const [userDoc, trendingData, nigeriaData] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getTrendingMovies(),
          getTopMoviesNigeria()
        ]);

        setTrending(trendingData);
        setTopNigeria(nigeriaData);

        if (!userDoc.exists() || !userDoc.data().setupComplete) {
          setShowOnboarding(true);
        } else {
          const favs = userDoc.data().favoriteGenres;
          if (favs && favs.length > 0) {
            const recData = await getMoviesByGenre(favs[0]);
            setRecommendations(recData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [user, showOnboarding]);

  // Handle Genre Switching loading
  useEffect(() => {
    if (selectedGenre !== 0) {
      const fetchGenreMovies = async () => {
        setLoading(true);
        const data = await getMoviesByGenre(selectedGenre);
        setGenreMovies(data);
        setLoading(false);
      };
      fetchGenreMovies();
    }
  }, [selectedGenre]);

  return (
    <div className="home-page">
      {showOnboarding && <GenrePicker onComplete={() => setShowOnboarding(false)} />}

      {/* Hero Carousel Skeleton */}
      {loading && selectedGenre === 0 ? (
        <div className="skeleton skeleton-hero" style={{ height: '70vh', width: '100%' }}></div>
      ) : (
        selectedGenre === 0 && <FeaturedCarousel movies={trending} />
      )}

      <div className="container">
        <header className="home-header">
          <h1 className="page-title">{selectedGenre === 0 ? "Browse" : "Discover"}</h1>
          <GenreFilter selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
        </header>

        {selectedGenre === 0 ? (
          <div className="home-rows">
            {/* If loading, show 3 skeleton rows */}
            {loading ? (
              <>
                <div className="skeleton-row-wrapper" style={{marginBottom: '2rem'}}>
                   <div className="skeleton skeleton-text" style={{width: '200px', height: '25px', marginBottom: '1rem'}}></div>
                   <div style={{display: 'flex', gap: '1rem', overflow: 'hidden'}}>
                      {[...Array(6)].map((_, i) => <MovieSkeleton key={i} />)}
                   </div>
                </div>
                <div className="skeleton-row-wrapper">
                   <div className="skeleton skeleton-text" style={{width: '200px', height: '25px', marginBottom: '1rem'}}></div>
                   <div style={{display: 'flex', gap: '1rem', overflow: 'hidden'}}>
                      {[...Array(6)].map((_, i) => <MovieSkeleton key={i} />)}
                   </div>
                </div>
              </>
            ) : (
              <>
                {recommendations.length > 0 && <MovieRow title="Recommended for You" movies={recommendations} />}
                {watchlist.length > 0 && <MovieRow title="My Watchlist" movies={watchlist} />}
                <MovieRow title="Top 10 in Nigeria Today 🇳🇬" movies={topNigeria} />
                <MovieRow title="Trending Worldwide" movies={trending} />
              </>
            )}
          </div>
        ) : (
          <div className="movie-grid">
            {loading 
              ? [...Array(12)].map((_, i) => <MovieSkeleton key={i} />) 
              : genreMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;