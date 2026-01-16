# MOVIEAPP: A Full-Stack Personalized Discovery Engine 🎬

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![TMDB](https://img.shields.io/badge/TMDB-01d277?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

## 📖 Overview

MovieApp is a high-performance, responsive web application designed to replicate the premium user experience of modern streaming platforms like Netflix. Beyond a simple movie database, this project implements a **Personalized Discovery System** that adapts the interface based on real-time user preferences stored in the cloud.

---

## 🛠 Technical Deep Dive

### 1. Advanced Authentication & Security

- **Multi-Provider Auth:** Implemented secure login via Google OAuth 2.0 and standard Email/Password using **Firebase Auth**.
- **Session Persistence:** Utilized `onAuthStateChanged` to maintain persistent user sessions, ensuring a seamless experience across browser refreshes.
- **Account Recovery:** Developed a dedicated password reset flow utilizing `sendPasswordResetEmail` to handle lost credentials securely.

### 2. Personalized Recommendation Logic

- **Cloud-Synced Preferences:** Built a "User Interest" schema in **Firestore** where movie genre IDs are stored upon onboarding.
- **Dynamic Filtering:** The "Recommended for You" engine queries these stored IDs to perform targeted API requests, ensuring the home feed is unique to every user.

### 3. Performance & Optimization

- \*\*Toast Notification System: Integrated react-hot-toast for non-intrusive, real-time feedback on actions like adding to watchlist or updating security settings.
- **Search Debouncing:** Integrated a custom 600ms debounce timer to the search input, drastically reducing API overhead and improving client-side performance.
- **Global State Management:** Leveraged the **React Context API** to manage Watchlist data and Auth states globally, eliminating "prop-drilling."

---

## ✨ Premium UI/UX Features

- **Skeleton Shimmer Screens:** Engineered a custom CSS animation system that provides "skeleton" placeholders during API calls, eliminating jarring layout shifts (CLS).
- **Hero Autoplay Engine:** Developed a background trailer system that fetches YouTube keys and autoplays muted high-definition trailers with a 3-second delay and smooth fade-in transitions.
- **Mobile-First Responsive Design:** Built a custom Hamburger navigation system and slide-out drawer optimized for touch-based interactions on mobile devices.
- \*\*Glassmorphism Design: Utilized backdrop-filter: blur() and semi-transparent layers to create a modern, frosted-glass interface that maintains readability over high-contrast movie art.

---

## 🗄 Database Schema (NoSQL)

The app uses a highly scalable Firestore structure:

```json
users: {
  "user_uid": {
    "email": "developer@example.com",
    "setupComplete": true,
    "favoriteGenres": [28, 12, 878],
    "searchHistory": ["Interstellar", "Dark Knight", "Inception"],
    "watchlist": [
       { "id": 550, "title": "Fight Club", "poster_path": "/pB8BM7..." }
    ]
  }
}

```

## 🚀 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/Keside2/movie-app-tmdb.git](https://github.com/Keside2/movie-app-tmdb.git)
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:Create a .env file in the root directory and add your keys:**
   ```Code snippet
   VITE_TMDB_API_KEY=your_tmdb_key
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
4. **Install Dependencies:**
   ```bash
   npm run dev
   ```

## 🎥 Media

### Home Page

![Home Page](./src/assets/movie-app-tmdb%20and%205%20more%20pages%20-%20Personal%20-%20Microsoft​%20Edge%2015_01_2026%2019_17_24.png)

### Search Page

![Search Page](./src/assets/movie-app-tmdb%20and%205%20more%20pages%20-%20Personal%20-%20Microsoft​%20Edge%2015_01_2026%2019_17_41.png)

### Profile Page

![Profile Page](./src/assets/movie-app-tmdb%20and%205%20more%20pages%20-%20Personal%20-%20Microsoft​%20Edge%2015_01_2026%2019_17_59.png)

## 🎓 Learning Outcomes

This project covers:

. Asynchronous API integration and data mapping.

. Cloud database architecture and real-time synchronization.

. Modern CSS techniques including Backdrop Filters and Keyframe Animations.

. Secure User Authentication flows.
