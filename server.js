const express = requires('express');
const db = require('./database');

const server = express();

server.use(express.json());

server.get('/users', (req, res) => {
    const users = db.getUsers();
    if (users) {
        res.json(users);
    } else {
        res.status(500).json({
            message: 'The users information could not be retrieved.',
        });
    };
});

server.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({
            message: 'The user with the specified ID does not exist.',
        });
    };
});

server.listen(3000, () => {
    console.log('Server Is Up');
});