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
// src/services/tmdbApi.js

export const getMovieDetails = async (movieId) => {
    const TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN; // Get your token

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    };

    try {
        // Notice we removed ?api_key=... and added the options object
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?language=en-US&append_to_response=videos,credits`,
            options
        );
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Details Fetch Error:", error);
    }
};

export const getTopMoviesNigeria = async () => {
    const TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    };

    try {
        // 'NG' is the ISO code for Nigeria
        const response = await fetch(
            `${BASE_URL}/discover/movie?language=en-US&region=NG&sort_by=popularity.desc&page=1`,
            options
        );
        const data = await response.json();
        return data.results.slice(0, 10); // Only take top 10
    } catch (error) {
        console.error("Nigeria Fetch Error:", error);
    }
};
