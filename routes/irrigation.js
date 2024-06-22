const express = require('express');
const router = express.Router();
const Irrigation = require('../models/Irrigation');
const ParcelConfig = require('../models/ParcelConfig');
const moment = require('moment');

// Add logic for irrigation scheduling and updating here

router.post('/irrigation', async (req, res) => {
    try {
        const irrigation = new Irrigation(req.body);
        await irrigation.save();
        res.status(201).send(irrigation);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/irrigation', async (req, res) => {
    try {
        const irrigations = await Irrigation.find().populate('config');
        res.status(200).send(irrigations);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
