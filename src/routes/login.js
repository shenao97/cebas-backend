const express = require('express');

const router = express.Router();

const { encryptPassword } = require('../utils/libs/CryptoJs');

const { POSTData } = require('../utils/services/WebServices');

const DEFAULT_LANGUAGE = 'es_ES'
const DEFAULT_MOBILE = false

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Inicia sesión 
 *     responses:
 *       200:
 *         status: 200
 *         data: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzYxZGM0OTgwYmYyNTlkYzJjYjY5ZSIsImlhdCI6MTcxOTIxNTUyOCwiZXhwIjoxNzE5MzAxOTI4fQ.bB4qD2Cerpf1oFKjC-1qigj6mecJQNFh2zufzvLk7Gc
 *       400:
 *         status: 400
 *         data: Server could not login.
 *       500:
 *         status: 500
 *         data: Server is not configured.
 */
router.get('/', async (_, res) => {
  try {
    const email = process.env.EMAIL
    const password = process.env.PASSWORD
    if (!email || !password) return { status: 500, message: 'Server is not configured' }
    const coddedPassword = encryptPassword(password);
    const response = await POSTData('/login', {
      login: email,
      password: coddedPassword,
      mobile: DEFAULT_MOBILE,
      lang: DEFAULT_LANGUAGE
    });
    const token = response.data.token
    res.status(200).json({
      status: 200,
      data: token
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Server could not login.'
    });
  }
});

module.exports = router;