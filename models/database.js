const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'projectdb.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = db;

// Create tables if they don't exist
db.serialize(() => {



    db.run(`CREATE TABLE IF NOT EXISTS site_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        page TEXT,
        username TEXT,
        ip TEXT,
        time TEXT
    )`);



    db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        company TEXT,
        streetAddress TEXT,
        city TEXT,
        country TEXT,
        state TEXT,
        zipCode TEXT,
        phone TEXT,
        contactMethod TEXT,
        category TEXT,
        otherCategory TEXT,
        projectStart TEXT,
        comments TEXT,
        emailOffers TEXT,
        time TEXT,
        ipAddress TEXT,
        userAgent TEXT
    )`);



    db.run(`CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        preset TEXT
    )`);




    db.run(`CREATE TABLE IF NOT EXISTS optionSets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        creationDate TEXT NOT NULL,
        editDate TEXT,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);





    db.run(`CREATE TABLE IF NOT EXISTS optionSetItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setId INTEGER,
        optionId INTEGER,
        position INTEGER,
        FOREIGN KEY (setId) REFERENCES optionSets(id),
        FOREIGN KEY (optionId) REFERENCES options(id)
    )`);







    db.run(`CREATE TABLE IF NOT EXISTS contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        userId INTEGER,
        creationDate TEXT NOT NULL,
        editDate TEXT,
        preset TEXT

    )`);


    db.run(`CREATE TABLE IF NOT EXISTS contractSets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        creationDate TEXT NOT NULL,
        editDate TEXT,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);





    db.run(`CREATE TABLE IF NOT EXISTS contractSetItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setId INTEGER,
        contractId INTEGER,
        position INTEGER,
        FOREIGN KEY (setId) REFERENCES contractSets(id),
        FOREIGN KEY (contractId) REFERENCES contracts(id)
    )`);











    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`);





    db.run(`CREATE TABLE IF NOT EXISTS login_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        login_time TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);




    


});

module.exports = db;
