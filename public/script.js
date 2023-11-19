document.addEventListener('DOMContentLoaded', () => {
    loadAlbums();
    document.getElementById('add-album-button').addEventListener('click', () => toggleAlbumForm());
    document.getElementById('album-form').addEventListener('submit', handleFormSubmit);
});

let currentEditingId = null; // Track the id of the album being edited

async function loadAlbums() {
    try {
        const response = await fetch('/api/albums');
        const albums = await response.json();
        displayAlbums(albums);
    } catch (error) {
        console.error('Error loading albums:', error);
    }
}

function displayAlbums(albums) {
    const albumList = document.getElementById('album-list');
    albumList.innerHTML = '';
    albums.forEach(album => {
        const albumElement = document.createElement('section');
        albumElement.classList.add('album');
        let songsList = album.songs.map(song => `<li>${song}</li>`).join('');
        albumElement.innerHTML = `
            <h3>${album.name}</h3>
            <p><strong>Artist:</strong> ${album.artist}</p>
            <p><strong>Release Year:</strong> ${album.releaseYear}</p>
            <p><strong>Genre:</strong> ${album.genre}</p>
            <p><strong>Description:</strong> ${album.description}</p>
            <ul>${songsList}</ul>
            <button onclick="editAlbum(${album._id})">Edit</button>
            <button onclick="deleteAlbum(${album._id})">Delete</button>
        `;
        albumList.appendChild(albumElement);
    });
}

function toggleAlbumForm(edit = false) {
    const formContainer = document.getElementById('album-form-container');
    formContainer.classList.toggle('hidden');
    if (!edit) {
        currentEditingId = null; 
        document.getElementById('album-form').reset();
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const fetchOptions = {
        method: currentEditingId ? 'PUT' : 'POST',
        body: formData
    };

    try {
        const response = await fetch(`/api/albums${currentEditingId ? '/' + currentEditingId : ''}`, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayAlbums(result);
        toggleAlbumForm();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

async function editAlbum(albumId) {
    const response = await fetch('/api/albums');
    const albums = await response.json();
    const albumToEdit = albums.find(album => album._id === albumId);
    if (albumToEdit) {
        const form = document.getElementById('album-form');
        form.name.value = albumToEdit.name;
        form.artist.value = albumToEdit.artist;
        form.releaseYear.value = albumToEdit.releaseYear;
        form.genre.value = albumToEdit.genre;
        form.description.value = albumToEdit.description;
        form.songs.value = albumToEdit.songs.join(', ');
        currentEditingId = albumId;
        toggleAlbumForm(true);
    }
}

async function deleteAlbum(albumId) {
    if (confirm('Are you sure you want to delete this album?')) {
        try {
            const response = await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            displayAlbums(result);
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    }
}
