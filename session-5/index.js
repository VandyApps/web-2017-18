const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const db = new sqlite3.Database('main.db');

db.run('CREATE TABLE IF NOT EXISTS albums (title TEXT PRIMARY KEY, artist TEXT, genre TEXT, year INTEGER)');

app.get('/add/:title/:artist/:genre/:year', (req, res) => {
    let title = req.params.title;
    let artist = req.params.artist;
    let genre = req.params.genre;
    let year = req.params.year;

    db.run('INSERT INTO albums VALUES (?, ?, ?, ?)', [title, artist, genre, year], err => {
        if (err) {
            res.send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/delete/:title', (req, res) => {
    db.run('DELETE FROM albums WHERE title = ? COLLATE NOCASE', [req.params.title], err => {
        if (err) {
            res.send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

app.get('/list', (req, res) => {
    db.all('SELECT * FROM albums', (err, rows) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/since/:year', (req, res) => {
    db.all('SELECT * FROM albums WHERE year >= ?', [req.params.year], (err, rows) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/genre/:genre', (req, res) => {
    db.all('SELECT * FROM albums WHERE genre = ? COLLATE NOCASE', [req.params.genre], (err, rows) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/artist/:artist', (req, res) => {
    db.all('SELECT * FROM albums WHERE artist = ? COLLATE NOCASE', [req.params.artist], (err, rows) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/search/:title', (req, res) => {
    db.all('SELECT * FROM albums WHERE title LIKE ? COLLATE NOCASE', ['%' + req.params.title + '%'], (err, rows) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rows);
        }
    });
});

app.listen(3000);