class vinyl {
    constructor(title, artist, genre, releaseYear, lpCount, coverArt) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.releaseYear = releaseYear;
        this.lpCount = lpCount;
        this.coverArt = coverArt;
    }
}

class collection {
    // Load collection from localStorage
    constructor() { 
        this.records = this.loadCollection();
    }

    loadCollection() {
        const collectionData = JSON.parse(localStorage.getItem("collection"));
        return collectionData ? collectionData : []; // Return the collection, otherwise initalise new array
    }

    // Save collection to local storage
    saveCollection() {
        localStorage.setItem("collection", JSON.stringify(this.records));
    }

    addVinyl(vinyl) {
        this.records.push(vinyl); // Push vinyl to collection
        this.saveCollection();
        displayCollection();
    }

    removeVinyl(vinylIndex) {
        // let vinylIndex = this.records.findIndex(vinyl => vinyl.title === name); // Find index of target vinyl
        if (vinylIndex >= 0) { // Validate input
            this.records.splice(vinylIndex, 1); 
            this.saveCollection();
            displayCollection();
        } else {
            alert("Error: Vinyl does not exist");
        }
    }
}

const myCollection = new collection();
const collectionDiv = document.querySelector("#collection");

function displayCollection() {
    collectionDiv.innerHTML = ''; // Reset collection
    myCollection.records.forEach((vinyl, index) => { // For each vinyl, create cover art image and paragraph
        // Creating a wrapper to help with styling
        const vinylWrapper = document.createElement("div");
        vinylWrapper.classList.add("vinylWrapper");
        collectionDiv.appendChild(vinylWrapper);

        const vinylArt = document.createElement("img");
        vinylArt.src = vinyl.coverArt;
        vinylArt.width = `300`;
        vinylWrapper.appendChild(vinylArt);

        const vinylTitle = document.createElement("p");
        vinylTitle.classList.add("vinylTitle");
        vinylTitle.setAttribute("data-index", index);
        vinylTitle.textContent = `${vinyl.title} (${vinyl.releaseYear})`;
        vinylWrapper.appendChild(vinylTitle);

        const vinylArtist = document.createElement("p");
        vinylArtist.classList.add("vinylArtist");
        vinylArtist.textContent = `${vinyl.artist}`;
        vinylWrapper.appendChild(vinylArtist);
        });
}

displayCollection();

// Retrieve album cover from LastFM
const apiUrl = "https://djmpidlk2d.execute-api.us-west-2.amazonaws.com/proxy-fm";

async function getAlbumCover(artist, album) {
    const cacheKey = `albumCover-${artist}-${album}`; 

    const cachedCover = localStorage.getItem(cacheKey); // Check cache before API call
    if (cachedCover) {
        return cachedCover;
    }

    try {
        const response = await fetch(`${apiUrl}?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch album cover");
        }
        const data = await response.json();
        const albumCover = data.image;

        localStorage.setItem(cacheKey, albumCover)

        return albumCover;
    } catch (error) {
        console.log("Error", error);
    }
}

async function createVinyl() {
    let title = document.querySelector("#title").value;
    let artist = document.querySelector("#artist").value;
    let genre = document.querySelector("#genre").value;
    let releaseYear = document.querySelector("#releaseYear").value;
    let lpCount = document.querySelector("#lpCount").value;
    let coverArt = await getAlbumCover(artist, title);
    let newVinyl = new vinyl(title, artist, genre, releaseYear, lpCount, coverArt);
    myCollection.addVinyl(newVinyl);
}

// Pop-up button for adding records
const openModalBtn = document.querySelector("#openModal");
const closeModalBtn = document.querySelector("#closeModal");
const modal = document.querySelector("#modal");
const modalOverlay = document.querySelector("#modalOverlay");
const recordForm = document.querySelector("#recordForm");

function openModal() {
    modalOverlay.style.display = "block";
    modal.style.display = "block";
}

function closeModal() {
    modalOverlay.style.display = "none";
    modal.style.display = "none";
}

openModalBtn.addEventListener("click", openModal);

closeModalBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", function() { // When user clicks on the modal overlay, close the modal
    modalOverlay.style.display = "none";

    // Check what modal is currently open, then close it
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else if (detailModal.style.display === "block") {
        detailModal.style.display = "none";
    }
});

// Form to enter vinyl details
recordForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Make sure form doesn't refresh page

    createVinyl(); 

    closeModal();
});

// Pop up for viewing record details
const vinylTitle = document.querySelector(".vinylTitle");
const detailModal = document.querySelector("#detailModal");
const closeDetailModalBtn = document.querySelector("#closeDetailModal");

function openDetailModal () {
    modalOverlay.style.display = "block";
    detailModal.style.display = "block";
}

function closeDetailModal () {
    modalOverlay.style.display = "none";
    detailModal.style.display = "none";
}

let currentRecordIndex; // Use this to keep track of the currently opened record

collectionDiv.addEventListener("click", function(event) {
    if (event.target.classList.contains("vinylTitle")) { // Open modal if vinyl title is clicked
        const index = event.target.getAttribute('data-index')
        currentRecordIndex = index;
        const currentRecord = myCollection.records[index];

        document.querySelector("#recordTitle").textContent = currentRecord.title;
        document.querySelector("#recordArtist").textContent = currentRecord.artist;
        document.querySelector("#recordGenre").textContent = currentRecord.genre;
        document.querySelector("#recordYear").textContent = currentRecord.releaseYear;
        document.querySelector("#recordDisc").textContent = currentRecord.lpCount;

        openDetailModal();
    }
})

closeDetailModalBtn.addEventListener("click", closeDetailModal);

// Code for buttons inside the detail modal
const changeCoverBtn = document.querySelector("#changeCoverBtn");
const removeVinylBtn = document.querySelector("#removeVinylBtn");

changeCoverBtn.addEventListener("click", function() {
    const newCoverUrl = prompt("Enter new cover art URL:");

    if (newCoverUrl) {
        myCollection.records[currentRecordIndex].coverArt = newCoverUrl;

        displayCollection();
        myCollection.saveCollection();
    }
});

removeVinylBtn.addEventListener("click", function () {
    myCollection.removeVinyl(currentRecordIndex);
    closeDetailModal();
})
