// #1 - import dependencies
const express = require('express');
const db = require('./database');

// #2 - instantiate and congigure server
const server = express();
server.use(express.json());
server.use(cors());

// #3 - decide port
const port = 3000;

// #4 - Endpoints:

// // #4a - [GET] /api/users - all users
server.get('/api/users', (req, res) => {
    const users = db.getUsers();
    if (users) {
        res.json(users);
    } else {
        res.status(404).json({
            message: 'The user with the specified ID does not exist.',
        });
    };
});

// // #4b - [GET] /api/users/:id - selected user
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);
    try {
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.',
            })
        }
    }
    catch {
        res.status(500).json({
            message: 'The user information could not be retrieved.',
        });
    };
});

// // #4c - [POST] /api/users - add new user
server.post('/api/users', (req,res) => {
    const { name, bio } = req.body;
    try {
        if (name && bio) {
            const newUser = db.createUser({
                name: name,
                bio: bio,
            })
            res.status(201).json(newUser)
        } else {
            res.status(400).json({
                message: 'Please provide name and bio for the user.',
            })
        }
    }
    catch {
        res.status(500).json({
            message: 'There was an error while saving the user to the database.',
        });
    };
});

// // #4d - [PUT] /api/users/:id - edit an existing user
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);
    const { name, bio } = req.body;
    try{
        if (user) {
            const updatedUser = db.updateUser(id, {
                name: name,
                bio: bio,
            })
            res.status(200).json(updatedUser);
        } else if (!name || !bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user.',
            })
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.',
            })
        }
    }
    catch {
        res.status(500).json({
            message: 'The user information could not be modified.',
        });
    };
});

// // #4e - [DELETE] - /api/users/:id - delete an existing user
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);
    try {
        if (user) {
            db.deleteUser(id)
            res.status(200).json({
                message: 'The user was successfully deleted.',
            })
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.',
            })
        }
    }
    catch {
        res.status(500).json({
            message: 'The user could not be removed.',
        });
    };
});
 
server.listen(port, () => {
    console.log('Server Is Up');
});