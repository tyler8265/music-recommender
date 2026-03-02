const router = require('express').Router();
const { getAuthURL, getTopArtists, getTopTracks, getRecommendations } = require('../services/spotify');

const requireAuth = (req, res, next) => {
    if(req.session.accessToken) {
        return next();
    }
    return res.redirect('/music/login');
}

router.get('/login', (req, res) => {
    try{
        const url = getAuthURL();
        res.redirect(url);
    } catch(error) {
        res.status(500).json({error: 'Failed to get Auth URL.' })
    }
})

router.get('/topArtists', requireAuth, async (req, res) => {
    try {
        if(req.session.topArtists) {
            return res.status(200).json({ artists: req.session.topArtists });
        }
        const topArtists = await getTopArtists(req.session.accessToken);
        req.session.topArtists = topArtists;
        req.session.genres = topArtists.flatMap(artist => artist.genres);
        res.status(200).json({ artists: req.session.topArtists });
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch top artists.' });
    }
})

router.get('/topTracks', requireAuth, async (req, res) => {
    try {
        if(req.session.topTracks) {
            return res.status(200).json({ tracks: req.session.topTracks });
        }
        const topTracks = await getTopTracks(req.session.accessToken);
        req.session.topTracks = topTracks;
        res.status(200).json({ tracks: req.session.topTracks });
    } catch(error) {
        res.status(500).json({ error: 'Failed to fetch top tracks.' });
    }
})

router.get('/recommend', requireAuth, async (req, res) => {
    try {
        const recommend = await getRecommendations(req.session.accessToken);
        res.status(200).json({
            Recommendations: recommend
        });
    } catch(error) {
        res.status(500).json({ error: 'Failed to get recommendations.' });
    }
})


module.exports = router;
