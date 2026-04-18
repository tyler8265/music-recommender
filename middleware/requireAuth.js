const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    if(req.session.spotifyId) {
        const user = await User.findOne({ spotifyId: req.session.spotifyId })
        if(user && user.accessToken) {
            req.user = user;
            return next();
        }
    }
    res.status(401).json({ error: 'Unauthorized' });
}

module.exports = requireAuth;