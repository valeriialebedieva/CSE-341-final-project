const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Welcome!');
});

router.use('/user', require('./user'));
router.use('/groceries', require('./groceries'));


module.exports = router;