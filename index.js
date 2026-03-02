require('dotenv').config();
const express = require('express');
const musicRoutes = require('./routes/music');
const session = require('express-session');
const { getToken } = require('./services/spotify');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: `${process.env.SECRET_SESSION}`,
    resave: false,
    saveUninitialized: false

}));

app.use('/music', musicRoutes);

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const { accessToken, refreshToken } =  await getToken(code);
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    res.redirect('/');
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/music/login');
})

app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT 3000...")
})
