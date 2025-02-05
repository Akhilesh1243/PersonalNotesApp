const API_URL = 'http://localhost:3000/notes';
const form = document.getElementById('noteForm');
const notesContainer = document.getElementById('notesContainer');

// Function to fetch and display notes
async function fetchNotes() {
    try {
        console.log('Fetching notes...');
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
        }

        const notes = await response.json();
        console.log('Fetched notes:', notes);

        // Clear the container before appending notes
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button onclick="deleteNote('${note._id}')">Delete</button>
                <button onclick="editNote('${note._id}')">Edit</button>
            `;
            notesContainer.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        alert(`Could not fetch notes: ${error.message}`);
    }
}

// Function to add a new note
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
        alert('Both title and content are required!');
        return;
    }

    try {
        console.log('Adding a new note...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add note: ${response.status} ${response.statusText}`);
        }

        const newNote = await response.json();
        console.log('Added new note:', newNote);

        form.reset(); // Clear the form
        fetchNotes(); // Refresh notes
    } catch (error) {
        console.error('Error adding note:', error);
        alert(`Could not add the note: ${error.message}`);
    }
});

// Function to delete a note
async function deleteNote(id) {
    try {
        console.log(`Deleting note with id: ${id}...`);
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
        }

        console.log(`Deleted note with id: ${id}`);
        fetchNotes(); // Refresh notes after deletion
    } catch (error) {
        console.error('Error deleting note:', error);
        alert(`Could not delete the note: ${error.message}`);
    }
}

// Function to edit a note
async function editNote(id) {
    const newTitle = prompt('Enter new title:').trim();
    const newContent = prompt('Enter new content:').trim();

    if (!newTitle || !newContent) {
        alert('Both title and content are required!');
        return;
    }

    try {
        console.log(`Editing note with id: ${id}...`);
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        if (!response.ok) {
            throw new Error(`Failed to edit note: ${response.status} ${response.statusText}`);
        }

        const updatedNote = await response.json();
        console.log('Edited note:', updatedNote);

        fetchNotes(); // Refresh notes after editing
    } catch (error) {
        console.error('Error editing note:', error);
        alert(`Could not edit the note: ${error.message}`);
    }
}

// Fetch notes on page load
fetchNotes();
