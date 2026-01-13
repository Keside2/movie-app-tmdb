import { createContext, useState, useEffect, useContext } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  // FIX: Load from localStorage directly in the useState initialization
  const [watchlist, setWatchlist] = useState(() => {
    const savedMovies = localStorage.getItem('movie-watchlist');
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  // Keep the save effect - this is still perfect
  useEffect(() => {
    localStorage.setItem('movie-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => [...prev, movie]);
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isWatched = (movieId) => watchlist.some((m) => m.id === movieId);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);