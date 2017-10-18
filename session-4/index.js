const express = require('express');
const app = express();
const fs = require('fs');

let message = fs.readFileSync('msg.txt');

app.get('/', (req, res) => {
    res.send(`The current message is ${message}`);
});

app.get('/msg/:message', (req, res) => {
    message = req.params.message;
    fs.writeFile('msg.txt', message, () => {});
    res.redirect('/');
});

app.listen(3000);