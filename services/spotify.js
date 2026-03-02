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
         return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token
        };
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
                limit: 10,
                time_range: 'medium_term'
             }
        })
        console.log(response.data.items);
        return response.data.items.map(artist => ({
            name: artist.name,
            genres: artist.genres,
            image: artist.images[0].url,
            id: artist.id
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
                limit: 10,
                time_range: 'medium_term'
             }
        })
        return response.data.items.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            date: track.album.release_date,
            image: track.album.images[0].url,
            id: track.id,
        }));
    } catch(error) {
        console.log(`Spotify error:`, error.response.data);
    }
}

const getRelatedArtists = async (artistName) => {
    try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
        params: {
                method: 'artist.getSimilar',
                artist: artistName,
                api_key: process.env.LASTFM_API_KEY,
                format: 'json',
                limit: 10
            }
        })
        console.log(response.data.similarartists.artist);
        return response.data.similarartists.artist.map(artist => ({
            name: artist.name,
            match: artist.match
        }))
    } catch(error) {
        console.log(`Error retrieving related artists: `, error.response.data);
    }
}

const getRecommendations = async (token) => {
    try {
        let topArtists = await getTopArtists(token);
        const topTracks = await getTopTracks(token);
        const topTracksIds = topTracks.map(track => ({ id: track.id }))
        const topTracksSet = new Set();
        topTracksIds.forEach(id => {
            topTracksSet.add(id);
        })
        const relatedArtists = await Promise.all(
            topArtists.map(artist => { return getRelatedArtists(artist.name) }
        ));
        topArtists = topArtists.map(artist => artist.name);
        const filteredRelatedArtists = relatedArtists.flat().filter(artist => {
           return !topArtists.includes(artist.name);
        });
        const relatedArtistsMap = new Map();
        for(let i = 0; i < filteredRelatedArtists.length; i++) {
            if(!relatedArtistsMap.has(filteredRelatedArtists[i].name)) {
                relatedArtistsMap.set(filteredRelatedArtists[i].name, {
                    ...filteredRelatedArtists[i],
                    count: 1
                });
            } else {
                let value = relatedArtistsMap.get(filteredRelatedArtists[i].name);
                value.count++;
            }
        }
        const sorted = [...relatedArtistsMap.values()].sort((a, b) => b.count - a.count).slice(0, 15);
        const randomizedSorted = sorted.sort(() => Math.random() - 0.5);
        let topRelatedPicks = await Promise.all(
            randomizedSorted.slice(0,5).map(artist => {
                return axios.get(`https://api.spotify.com/v1/search`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        q: artist.name,
                        market: 'US',
                        type: 'track',
                        limit: 5
                    }
                })
            })
        )
        const randomizedTopTracks = topRelatedPicks.sort(() => Math.random() - 0.5);
        const tracks = randomizedTopTracks.flatMap(res => res.data.tracks.items.slice(0, 5));
        const tracksFilter = tracks.filter(track => {
            !topTracksSet.has(track);
        })
        return tracks.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            image: track.album.images[0],
            id: track.id
        }))
    } catch(error) {
        console.log(`Error while trying to get recommendations: `, error.response.data);
    }
}

module.exports = { getAuthURL, getToken, getTopArtists, getTopTracks, getRecommendations };
