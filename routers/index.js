const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Welcome!');
});

router.use('/user', require('./user'));
router.use('/groceries', require('./groceries'));
router.use('/clothes', require('./clothes'));
router.use('/electronics', require('./electronics'));


module.exports = router;