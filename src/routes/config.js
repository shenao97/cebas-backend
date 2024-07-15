const express = require('express');
const router = express.Router();
const ParcelConfig = require('../models/ParcelConfig');

router.get('/', async (req, res) => {
    try {
        const config = await ParcelConfig.find();
        res.status(200).json({ status: 200, data: config });
    } catch (error) {
        console.error(error);
        res.status(404).json({ status: 404, message: "There're not an available configurations" });
    }
});

router.post('/', async (req, res) => {
    try {
        const parcel = req.body;
        const config = new ParcelConfig(parcel);
        await config.save();
        res.status(201).json({ status: 201, data: config });
    } catch (error) {
        res.status(400).json({ status: 404, message: "Parcel configuration cannot be saved." });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newParcel = req.body;
        const updatedParcel = await ParcelConfig.findByIdAndUpdate(id, newParcel)
        if(!updatedParcel) return res.status(404).json({ status: 404, message: "There's not a configuration available" })
        res.status(201).json({ status: 201, data: newParcel });
    } catch (error) {
        res.status(400).json({ status: 404, message: "Parcel configuration cannot be saved." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedParcel = await ParcelConfig.findByIdAndDelete(id)
        if(!deletedParcel) return res.status(404).json({ status: 404, message: "There's not a configuration available" })
        res.status(201).json({ status: 200, data: deletedParcel });
    } catch (error) {
        console.error(error)
        res.status(400).json({ status: 400, message: "Parcel configuration cannot be deleted." });
    }
});

module.exports = router;
