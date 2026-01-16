import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './Profile.css';
import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { useWatchlist } from '../../context/WatchListContext';
import { updatePassword } from 'firebase/auth'; // Import the Firebase method
import toast from 'react-hot-toast';

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
  const { watchlist } = useWatchlist();
  const [selectedGenres, setSelectedGenres] = useState([]);
  
  // New States for Password Update
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);

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
  // Find the genre name for the toast message
  const genreName = GENRES.find(g => g.id === genreId)?.name;

  const isRemoving = selectedGenres.includes(genreId);
  
  const updatedGenres = isRemoving
    ? selectedGenres.filter(id => id !== genreId)
    : [...selectedGenres, genreId];

  setSelectedGenres(updatedGenres);

  // Show the toast feedback
  if (isRemoving) {
    toast(`Removed ${genreName}`, { icon: '🗑️' });
  } else {
    toast.success(`Added ${genreName} to your interests! 🍿`);
  }

  // Save to Firestore
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { favoriteGenres: updatedGenres }, { merge: true });
  } catch (error) {
    toast.error("Failed to save preferences.");
  }
};

  // Password Update Handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordStatus({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }

    setIsUpdating(true);
    setPasswordStatus({ type: "", message: "" });

    try {
      await updatePassword(user, newPassword);
     toast.success("Password updated successfully! 🔐");
      setNewPassword(""); // Clear input
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Please re-login to change password.");
      } else {
        setPasswordStatus({ type: "error", message: error.message });
      }
    } finally {
      setIsUpdating(false);
    }
  };

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
          <NavLink to="/watchlist" className="nav-link-stat">
            <div className="stat-box">
              <span>Watchlist</span>
              <strong>{watchlist.length}</strong>
            </div>
          </NavLink>
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

        {/* New Security Section */}
        <div className="security-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="password-form">
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="password-input"
            />
            <button type="submit" disabled={isUpdating} className="update-btn">
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </form><br />
          {passwordStatus.message && (
            <p className={`status-msg ${passwordStatus.type}`}>{passwordStatus.message}</p>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn">Log Out</button>
      </div>
    </div>
  );
};

export default Profile;