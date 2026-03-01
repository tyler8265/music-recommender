const axios = require('axios');
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURI = process.env.SPOTIFY_REDIRECT_URI;
const state = require('crypto').randomBytes(16).toString('hex');

const getAuthURL =  () => {
    const authURL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&state=${state}&scope=${'user-top-read'}`
    return authURL;
}

const getToken = async (code) => {
    try {
        const credentials = Buffer.from((`${clientId}:${clientSecret}`)).toString('base64');
        const response = await axios.post('https://accounts.spotify.com/api/token', `grant_type=authorization_code&code=${code}&redirect_uri=${redirectURI}`,
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data.access_token;
    } catch (error) {
        console.log('Spotify error:', error.response.data);
    }
}

const getTopArtists = async (token) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                limit: 5,
                time_range: 'long_term'
             }
        })
        return response.data.items.map(artist => ({
            artist: artist.name,
            genres: artist.genres,
            image: artist.images[0].url,
            artistID: artist.id
        }))
    } catch(error) {
        console.log(`Spotify error:`, error.response.data);
    }
}

const getTopTracks = async(token) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                limit: 5,
                time_range: 'long_term'
             }
        })
        return response.data.items.map(track => ({
            name: track.name,
            artist: track.arists[0].name,
            album: track.album.name,
            date: track.album.release_date,
            image: track.album.images[0].url,
            trackId: track.id,
            playback: track.preview_url
        }));
    } catch(error) {
        console.log(`Spotify error:`, error.response.data);
    }
}

const getRecommendations = async (token, genres) => {
    try {
        const seedArtists = await getTopArtists(token);
        const seedTracks = await getTopTracks(token);
        const artists = new Set();
        const tracks = new Set();
        for(let i = 0; i < 2; i++) {
            artists.add(seedArtists[Math.floor(Math.random() * seedArtists.length)].id);
            tracks.add(seedTracks[Math.floor(Math.random() * seedTracks.length)].id);
        }
        const response = axios.get()
    } catch(error) {
        console.log(`Error while trying to get recommendations: `, error.response.data);
    }
}

module.exports = { getAuthURL, getToken, getTopArtists, getTopTracks, getRecommendations };
