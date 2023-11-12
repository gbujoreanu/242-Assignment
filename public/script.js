document.addEventListener('DOMContentLoaded', () => {
    loadAlbums();
    document.getElementById('add-album-button').addEventListener('click', toggleAddAlbumForm);
    document.getElementById('album-form').addEventListener('submit', handleFormSubmit);
});

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
        `;
        albumList.appendChild(albumElement);
    });
}


function toggleAddAlbumForm() {
    const formContainer = document.getElementById('album-form-container');
    formContainer.classList.toggle('hidden');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
        const response = await fetch('/api/albums', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayAlbums(result);
        toggleAddAlbumForm();
        event.target.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
