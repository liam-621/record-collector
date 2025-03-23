class vinyl {
    constructor(title, artist, genre, releaseYear, condition, coverArt) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.releaseYear = releaseYear;
        this.condition = condition;
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
        this.records.splice(this.records.findIndex(vinyl => vinyl.title === name), 1); // Find index of inputted title and remove it
        this.saveCollection();
        displayCollection();
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

        const vinylInfo = document.createElement("p");
        vinylInfo.textContent = `${vinyl.title} (${vinyl.releaseYear}) by ${vinyl.artist}`;
        vinylWrapper.appendChild(vinylInfo);
        });
}

displayCollection();

const addBtn = document.querySelector("#addVinyl"); // Prompt user for vinyl information
addBtn.addEventListener("click", function() {
    let title = prompt("Title?");
    let artist = prompt("Artist?");
    let genre = prompt("Genre?");
    let releaseYear = prompt("Release Year?")
    let condition = prompt("Condition?");
    let coverArt = prompt("Please link a cover art image.")
    let newVinyl = new vinyl(title, artist, genre, releaseYear, condition, coverArt);
    myCollection.addVinyl(newVinyl);
});

const removeBtn = document.querySelector("#removeVinyl");
removeBtn.addEventListener("click", function() {
    myCollection.removeVinyl(prompt("Enter the title of the vinyl you'd like to remove")); // Prompt user for title to remove
});


    

