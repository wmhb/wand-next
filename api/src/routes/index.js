const router = require('express').Router();
const auth = require('./authentication')
const base = require('./base')

/**
 * Base Routes
 */
router.use('/api', base);
/**
 * Authenticated Routes
 */
router.use('/api/auth', auth);

module.exports = router;
