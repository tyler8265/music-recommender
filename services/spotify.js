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
        console.log('Spotify errorL', error.response.data);
    }
}

const getTopArtists = async (token) => {

}

const getTopTracks = async(token) => {

}

const getRecommendations = async (genres) => {

}

module.exports = { getAuthURL, getToken };
