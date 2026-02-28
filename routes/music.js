const router = require('express').Router();



router.get('/search', (req, res) => {
    const data = req.query.q;
    res.status.send({ message: 'Searched Song' })
})

router.get('/track/:id', (req, res) => {
    const id = req.params.id;
    res.status(401).send({ id: req.params.id })
})

router.get('/recommend', (req, res) => {
    const recommend = req.body;
    res.send({message: 'Recommended Song '});
})


module.exports = router
