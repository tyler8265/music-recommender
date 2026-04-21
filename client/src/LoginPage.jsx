import musicImg from './assets/music-recommender-png.png'

const LoginPage = () => {
  return (
    <div>
      <h1>
        LOGIN PAGE
      </h1>
      <img src={musicImg} style={{ width: '300px' }}></img>
      <button onClick={() => window.location.href = '/login'}>
        Login with Spotify
      </button>
    </div>
  )
}

export default LoginPage