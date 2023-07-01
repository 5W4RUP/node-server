const Note = require('../models/note-model');
const express = require('express');
const router = new express.Router();

// Fetch latest notifications by type public
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ type: 1 }).sort({ created_at: -1 }).select('title');
        
        res.status(200).json({
            status: true,
            data: {
                notes
            }
        });
    } catch (e) {
        res.status(500).send();
    }
};

//get notification by ID
const getNotesById = async (req, res) => {
    const _id = req.params.id;

    try {
        const note = await Note.findById(_id);
        res.send(note);
    } catch (err) {
        res.status(404).json({
            Status: 'Failed',
            Message: `No Notification found with given id: ${_id}`,
            Error: err
        });
    }
};

module.exports = {
    getNotes,
    getNotesById
}