import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import './MovieReviews.css'

function MovieReviews({ movieId }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { user } = useAuth();

  // Load reviews in real-time
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("movieId", "==", movieId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      await addDoc(collection(db, "reviews"), {
        movieId,
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        text: reviewText,
        rating: rating,
        createdAt: serverTimestamp()
      });
      setReviewText('');
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <div className="reviews-section container">
      {/* <h3>Community Reviews ({reviews.length})</h3> */}
      
      {/* {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          
          <div className="star-rating-input">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || rating) ? "on" : "off"}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
            <span className="rating-label">{rating} / 5 Stars</span>
          </div>

          <textarea 
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button type="submit">Post Review</button>
        </form>
      ) : (
        <p>Please log in to leave a review.</p>
      )} */}

      {/* <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="user-info">
                <strong>@{review.userName}</strong>
                
                <div className="user-rating">
                   {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <span>{review.createdAt ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
            </div>
            <p>{review.text}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default MovieReviews;