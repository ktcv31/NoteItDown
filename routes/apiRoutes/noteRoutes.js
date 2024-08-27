const router = require("express").Router();
const {
    notes
} = require('../../db/db');
const {
    createNewNote,
    deleteNote
} = require('../../lib/note');


router.get('/notes', (req, res) => {
    res.json(notes);
});


router.post('/notes', (req, res) => {
    req.body.id = notes.length.toString(); 
    const note = createNewNote(req.body, notes); 
    res.json(note); 
});


router.delete('/notes/:id', (req, res) => {
    const updatedNotes = deleteNote(req.params.id, notes);
    res.json(updatedNotes); 
});

module.exports = router;
