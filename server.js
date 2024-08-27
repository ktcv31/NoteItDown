const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'Develop/public')));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Develop/public/index.html')));


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'Develop/public/notes.html')));

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }
    
    const notes = JSON.parse(data).notes || [];
    res.json(notes);
  });
});


app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      id: uniqid(), 
      title,
      text,
    };

    fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data.' });
      }
      const notesData = JSON.parse(data);
      const notes = notesData.notes || [];
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify({ notes }, null, 2), err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to write new note.' });
        }
        res.json(newNote);
      });
    });
  } else {
    res.status(400).json({ error: 'Title and text are required.' });
  }
});


app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    let notesData = JSON.parse(data);
    const notes = notesData.notes || [];

    const filteredNotes = notes.filter(note => note.id !== noteId);

    fs.writeFile(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify({ notes: filteredNotes }, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete note.' });
      }
      res.json({ message: `Note with ID ${noteId} deleted.` });
    });
  });
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
