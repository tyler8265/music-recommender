# Music Recommendation Software

A web application that connects to your Spotify account, analyzes your listening history, and recommends new songs and albums tailored to your taste.

---

## How It Works

1. User logs in with their Spotify account via OAuth 2.0
2. The app fetches the user's top artists and tracks
3. That data is used to seed Spotify's recommendation engine
4. The app returns personalized song and album recommendations

---

## Tech Stack

- **Node.js** — runtime environment
- **Express.js** — backend framework
- **Spotify Web API** — authentication and music data
- **Vanilla JavaScript** — frontend interface
- **express-session** — session management

---

## Getting Started

### Prerequisites
- Node.js installed
- A Spotify account
- A Spotify Developer app ([create one here](https://developer.spotify.com/dashboard))

### Installation

```bash
git clone https://github.com/yourusername/music-recommender.git
cd music-recommender
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```
PORT=3000
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
SESSION_SECRET=your_session_secret_here
```

### Running the App

```bash
npm run dev
```

Then open `http://127.0.0.1:3000` in your browser.

---

## Project Structure

```
music-recommender/
├── public/
│   ├── index.html
│   └── app.js
├── routes/
│   └── music.js
├── services/
│   └── spotify.js
├── .env
├── .gitignore
├── index.js
└── package.json
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /music/login | Redirects user to Spotify login |
| GET | /callback | Handles Spotify OAuth callback |
| GET | /music/top-artists | Returns user's top 5 artists |
| GET | /music/top-tracks | Returns user's top 5 tracks |
| GET | /music/recommendations | Returns personalized recommendations |
| GET | /music/logout | Logs user out and destroys session |

---

## Future Improvements

- Refresh token handling for sessions longer than 60 minutes
- Save recommendations as a Spotify playlist
- Mood-based filtering using Spotify's audio features
- React frontend
- Database integration for storing user preferences
- Deploy to production

---
