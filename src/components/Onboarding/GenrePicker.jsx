import { useState } from 'react';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import './GenrePicker.css';

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" }
];

function GenrePicker({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const { user } = useAuth();

  const toggleGenre = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const savePreferences = async () => {
    if (selected.length === 0) return alert("Pick at least one!");
    
    try {
      await setDoc(doc(db, "users", user.uid), {
        favoriteGenres: selected,
        setupComplete: true
      });
      onComplete();
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="genre-card">
        <h2>What do you love to watch?</h2>
        <p>We'll use this to personalize your feed.</p>
        <div className="genre-grid">
          {GENRES.map(genre => (
            <button 
              key={genre.id}
              className={`genre-chip ${selected.includes(genre.id) ? 'active' : ''}`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <button className="save-btn" onClick={savePreferences}>Start Watching</button>
      </div>
    </div>
  );
}

export default GenrePicker;