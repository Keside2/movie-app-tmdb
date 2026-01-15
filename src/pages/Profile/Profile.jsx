import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './Profile.css';
import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useWatchlist } from '../../context/WatchListContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


const GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
];


const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [setWatchlistCount] = useState(0);
   const { watchlist } = useWatchlist();
   const [selectedGenres, setSelectedGenres] = useState([]);

   // Fetch saved genres on load
  useEffect(() => {
    const fetchUserGenres = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setSelectedGenres(userDoc.data().favoriteGenres || []);
      }
    };
    fetchUserGenres();
  }, [user]);

  const toggleGenre = async (genreId) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];

    setSelectedGenres(updatedGenres);

    // Save to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { favoriteGenres: updatedGenres }, { merge: true });
  };

  useEffect(() => {
    if (!user) return;

    // Point to your watchlist collection and filter by current user
    const q = query(
      collection(db, "watchlist"), 
      where("userId", "==", user.uid)
    );

    // Listen for real-time changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWatchlistCount(snapshot.size); // .size gives the total document count
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.email}&background=random&color=fff`} 
            alt="Avatar" 
            className="profile-avatar"
          />
          <h2>{user?.displayName || "Movie App"}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="profile-stats">
          <NavLink 
              to="/watchlist" 
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} 
            >
          <div className="stat-box">
            <span>Watchlist</span>
            <strong> {watchlist.length > 0 && (
                <span className="watchlist-count">{watchlist.length}</span>
              )}</strong>
          </div>
          </NavLink>
          <div className="stat-box">
            <span>Reviews</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="genre-section">
          <h3>Your Interests</h3>
          <div className="genre-grid">
            {GENRES.map((genre) => (
              <button
                key={genre.id}
                className={`genre-chip ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                onClick={() => toggleGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">Log Out</button>
        
      </div>
    </div>
  );
};

export default Profile;