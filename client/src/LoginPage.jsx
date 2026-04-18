const LoginPage = () => {
  return (
    <div>
      <h1>
        LOGIN PAGE
      </h1>
      <img src='./assets/music-recommender-png.png'></img>
      <button onClick={() => window.location.href = '/login'}>
        Login with Spotify
      </button>
    </div>
  )
}

export default LoginPage