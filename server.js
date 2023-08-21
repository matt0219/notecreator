const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'db.json');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});


// API Routes
app.get('/api/notes', (req, res) => {
    console.log('GET /api/notes request received');
    try {
        const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        console.log('Notes read from file:', notes);
        res.json(notes);
    } catch (error) {
        console.error('Error reading notes from file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    newNote.id = notes.length + 1; // Generate a unique ID
    notes.push(newNote);
    fs.writeFileSync(dbFilePath, JSON.stringify(notes));
    res.json(newNote); // Send the new note as a response
});


// Start the server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});

