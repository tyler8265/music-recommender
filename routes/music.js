const router = require('express').Router();
const User = require('../models/User');
const { getAuthURL, getTopArtists, getTopTracks, getRecommendations } = require('../services/spotify');

const requireAuth = async (req, res, next) => {
    if(req.session.spotifyId) {
        const user = await User.findOne({ spotifyId: req.session.spotifyId })
        if(user && user.accessToken) {
            req.user = user;
            return next();
        }
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
        if(req.user.topArtists.length > 0) {
            return res.status(200).json({ artists: req.user.topArtists });
        }
        const topArtists = await getTopArtists(req.user.accessToken);
        req.user.topArtists = topArtists;
        await req.user.save();
        res.status(200).json({ artists: req.user.topArtists });
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch top artists.' });
    }
})

router.get('/topTracks', requireAuth, async (req, res) => {
    try {
        if(req.user.topTracks.length > 0) {
            return res.status(200).json({ tracks: req.user.topTracks });
        }
        const topTracks = await getTopTracks(req.user.accessToken);
        req.user.topTracks = topTracks;
        await req.user.save();
        res.status(200).json({ tracks: req.user.topTracks });
    } catch(error) {
        res.status(500).json({ error: 'Failed to fetch top tracks.' });
    }
})

router.get('/recommend', requireAuth, async (req, res) => {
    try {
        req.user.recommendations = [];
        await req.user.save();
        const recommendations = await getRecommendations(req.user.accessToken);
        req.user.recommendations = recommendations;
        await req.user.save();
        res.status(200).json({
            recommendations: req.user.recommendations
        });
    } catch(error) {
        res.status(500).json({ error: 'Failed to get recommendations.' });
    }
})



module.exports = router;
