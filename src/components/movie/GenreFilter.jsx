import './GenreFilter.css';

const genres = [
  { id: 0, name: "Trending" }, // Default state
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
];

function GenreFilter({ selectedGenre, setSelectedGenre }) {
  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
          onClick={() => setSelectedGenre(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;