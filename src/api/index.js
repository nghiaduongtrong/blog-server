const router = require('express').Router();
const authRoutes = require('./auth/AuthRoutes');
const managerRoutes = require('./manager/ManagerRoutes');

router.use('/auth', authRoutes);
router.use('/manager', managerRoutes);

module.exports = router;