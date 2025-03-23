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
    }

    removeVinyl(name) {
        this.records.splice(this.records.findIndex(vinyl => vinyl.title === name), 1); // Find index of inputted title and remove it
        this.saveCollection();
    }
}

const myCollection = new collection();

const addBtn = document.querySelector("#addVinyl"); // Prompt user for vinyl information
addBtn.addEventListener("click", function() {
    let title = prompt("Title?");
    let artist = prompt("Artist?");
    let genre = prompt("Genre?");
    let releaseYear = prompt("Release Year?")
    let condition = prompt("Condition?");
    let newVinyl = new vinyl(title, artist, genre, releaseYear, condition);
    myCollection.addVinyl(newVinyl);
});

const removeBtn = document.querySelector("#removeVinyl");
removeBtn.addEventListener("click", function() {
    myCollection.removeVinyl(prompt("Enter the title of the vinyl you'd like to remove")); // Prompt user for title to remove
});

const printBtn = document.querySelector("#printCollection");

printBtn.addEventListener("click", function() { 
    myCollection.records.forEach(vinyl => { // For each vinyl, create a paragraph with vinyl info and append to collection div
         const vinylInfo = document.createElement("p");
         vinylInfo.textContent = `${vinyl.title} (${vinyl.releaseYear}) by ${vinyl.artist}`;
         document.querySelector("#collection").appendChild(vinylInfo);
        });
});

