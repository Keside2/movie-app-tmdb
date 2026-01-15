import { useState } from 'react';
import { auth, googleProvider } from '../../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail // 1. Import this from Firebase
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // 2. State for success messages
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(''); // Clear messages on new attempt
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/'); 
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  // 3. Reset Password Function
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first so we can send a reset link.");
      return;
    }
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
      setMessage("Success! Check your email inbox for the reset link.");
    } catch (err) {
      setError("Failed to send reset email. Make sure the email is correct.");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? 'Sign In' : 'Create Account'}</h1>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>} {/* Success UI */}

        <form onSubmit={handleAuth} className="auth-form">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required={isLogin} // Only required for login/signup, not reset
            />
          </div>

          {/* 4. Forgot Password Link - Only show when on Login mode */}
          {isLogin && (
            <p className="forgot-password-link" onClick={handleForgotPassword}>
              Forgot password?
            </p>
          )}
          
          <button type="submit" className="auth-main-btn">
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogle} className="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <p className="auth-toggle">
          {isLogin ? "New to MOVIEAPP?" : "Already have an account?"}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setMessage('');
          }}>
            {isLogin ? ' Sign up now.' : ' Sign in here.'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;