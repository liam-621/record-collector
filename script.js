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
        this.records = [];
    }

    addVinyl(vinyl) {
        this.records.push(vinyl);
    }

    display() {
        console.log(this.records);
    }
}

const newVinyl = new vinyl("After Hours", "The Weeknd", "R&B", "2020", "Good");
const myCollection = new collection();

myCollection.addVinyl(newVinyl);

myCollection.display();