const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/Note');

const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

mongoose
    .connect(
        'mongodb+srv://Akhilesh1:akhilesh@akhilesh1.d6wmv.mongodb.net/notesApp?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// Test route to ensure the server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Add a new note
app.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const newNote = new Note({
            title,
            content,
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes); // Changed status code to 200 for GET
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a note by ID
app.put('/notes/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a note by ID
app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
