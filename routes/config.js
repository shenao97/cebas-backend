const express = require('express');
const router = express.Router();
const ParcelConfig = require('../models/ParcelConfig');

router.post('/config', async (req, res) => {
    try {
        const config = new ParcelConfig(req.body);
        await config.save();
        res.status(201).send(config);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/config', async (req, res) => {
    try {
        const config = await ParcelConfig.find();
        res.status(200).send(config);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
