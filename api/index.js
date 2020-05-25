const router = require('express').Router();
const authRoutes = require('./auth/AuthRoutes');

router.use('/auth', authRoutes);

module.exports = router;