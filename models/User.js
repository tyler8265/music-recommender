const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: String,
    refreshToken: String,
    topArtists: Array,
    topTracks: Array,
    recommendations: Array
})

module.exports = mongoose.model('User', userSchema);
