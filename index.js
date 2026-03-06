require('dotenv').config();
const express = require('express');
const musicRoutes = require('./routes/music');
const session = require('express-session');
const { getToken, getUser } = require('./services/spotify');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use(session({
    secret: `${process.env.SECRET_SESSION}`,
    resave: false,
    saveUninitialized: false

}));

app.use('/music', musicRoutes);

app.get('/', (req, res) => {
    if(req.session.status) {
        return res.send(`Home Page: ${req.session.status}`);
    }
    return res.send(`Home Page, not logged in.`);
});

app.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { accessToken, refreshToken } =  await getToken(code);
        const id = await getUser(accessToken);
        await User.findOneAndUpdate(
            { spotifyId: id },
            {
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            {
                upsert: true
            }
        )
        req.session.spotifyId = id;
        req.session.status = 'Logged In';

        res.redirect('/');
    } catch(error) {
        console.log(error);
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .then(() => app.listen(process.env.PORT, () => {
        console.log("Server is running on PORT 3000...")
    }))
    .catch(error => console.log('MongoDB error: ', error));
