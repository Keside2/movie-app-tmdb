// src/services/tmdbApi.js

const TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromApi = async (endpoint, params = "") => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}` // This is where the token goes
        }
    };

    try {
        const response = await fetch(
            `${BASE_URL}${endpoint}?language=en-US${params}`,
            options
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return [];
    }
};


// 1. Get Trending Movies (Day)
export const getTrendingMovies = () => {
    return fetchFromApi('/trending/movie/day');
};

// 2. Get Movies by Genre (For Personalized Feed)
export const getMoviesByGenre = (genreIds) => {
    return fetchFromApi('/discover/movie', `&with_genres=${genreIds}`);
};

// 3. Search Movies
export const searchMovies = (query) => {
    return fetchFromApi('/search/movie', `&query=${encodeURIComponent(query)}`);
};

// 4. Get Movie Details (Single Movie)
export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`
        );
        return await response.json();
    } catch (error) {
        console.error("Details Fetch Error:", error);
    }
};

