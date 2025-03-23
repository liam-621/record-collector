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

    removeVinyl(name) {
        let vinylIndex = this.records.findIndex(vinyl => vinyl.title === name); // Find index of target vinyl
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

function displayCollection() {
    const collectionDiv = document.querySelector("#collection");
    collectionDiv.innerHTML = ''; // Reset collection
    myCollection.records.forEach(vinyl => { // For each vinyl, create cover art image and paragraph
        // Creating a wrapper to help with styling
        const vinylWrapper = document.createElement("div");
        vinylWrapper.setAttribute("id", "vinylWrapper");  
        collectionDiv.appendChild(vinylWrapper);

        const vinylArt = document.createElement("img");
        vinylArt.src = vinyl.coverArt;
        vinylWrapper.appendChild(vinylArt);

        const vinylTitle = document.createElement("p");
        vinylTitle.setAttribute("id", "vinylTitle");
        vinylTitle.textContent = `${vinyl.title} (${vinyl.releaseYear})`;
        vinylWrapper.appendChild(vinylTitle);

        const vinylArtist = document.createElement("p");
        vinylArtist.setAttribute("id", "vinylArtist");
        vinylArtist.textContent = `${vinyl.artist}`;
        vinylWrapper.appendChild(vinylArtist);
        });
}

displayCollection();

const addBtn = document.querySelector("#addVinyl"); // Prompt user for vinyl information
addBtn.addEventListener("click", createVinyl);

const removeBtn = document.querySelector("#removeVinyl");
removeBtn.addEventListener("click", function() {
    myCollection.removeVinyl(prompt("Enter the title of the vinyl you'd like to remove")); // Prompt user for title to remove
});

// Retrieve album cover from LastFM
const apiUrl = "https://bqphu3g3e0.execute-api.us-west-2.amazonaws.com/lastfm-proxy";

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
    let title = prompt("Title?");
    let artist = prompt("Artist?");
    let genre = prompt("Genre?");
    let releaseYear = prompt("Release Year?")
    let lpCount = prompt("How many LPs?");
    let coverArt = await getAlbumCover(artist, title);
    let newVinyl = new vinyl(title, artist, genre, releaseYear, lpCount, coverArt);
    myCollection.addVinyl(newVinyl);
}