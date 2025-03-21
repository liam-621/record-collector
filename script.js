class vinyl {
    constructor(title, artist, genre, releaseYear, condition) {
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.releaseYear = releaseYear;
        this.condition = condition;
    }
}

class collection {
    constructor() {
        this.records = []; // Initalize array for collection
    }

    addVinyl(vinyl) {
        this.records.push(vinyl); // Push vinyl to collection
    }
}

const newVinyl = new vinyl("After Hours", "The Weeknd", "R&B", "2020", "Good");
const myCollection = new collection();

myCollection.addVinyl(newVinyl);

// Convert collection to a string for outputting
const collectionString = myCollection.records.map(vinyl => `${vinyl.title} by ${vinyl.artist}`).join("\n");

const btn = document.querySelector("button");

btn.addEventListener("click", function() { // Listener for button which will print collection
    document.querySelector("p").textContent = collectionString;
});


