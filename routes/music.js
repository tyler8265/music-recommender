const router = require('express').Router();
const { getTopArtists, getTopTracks, getRecommendations } = require('../services/spotify');
const  requireAuth = require('../middleware/requireAuth');


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
        if(req.user.recommendations.length < 1) {
            req.user.recommendations = [];
        }
        await req.user.save();
        let filteredRecommendations = [], existingIds = [], recommendations = [];
        let i = 0;
        while(filteredRecommendations.length < 10) {
            recommendations = await getRecommendations(req.user.accessToken);
            existingIds = new Set(req.user.recommendations.map(recommendation => recommendation.id));
            filteredRecommendations = recommendations.filter(recommendation => !existingIds.has(recommendation.id));
            if(i == 5) {
                break;
            }
            i++;
        } 
        req.user.recommendations.push(...filteredRecommendations);
        await req.user.save();
        res.status(200).json({
            recommendations: filteredRecommendations
        });
    } catch(error) {
        res.status(500).json({ error: 'Failed to get recommendations.' });
    }
})

router.get('/recommendationHistory', requireAuth, async(req, res) => {
    try {
        res.status(200).json({
            recommendationHistory: req.user.recommendations
        })
    } catch(error) {
        res.status(500).json({ error: 'Failed to get recommendation history.'});
    }
})


module.exports = router;
