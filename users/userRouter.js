const express = require('express');
const User = require('./userDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    User.insert(req.body)
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Could not post user"});
        });
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
    User.get()
        .then(users => {
            res.status(204).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Cannot get users"});
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;
    User.getUserPosts(id)
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error getting users"})
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    User.remove(id)
        .then(() => res.status(204).end())
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error deleting user"});
        });
});

router.put('/', (req, res) => {

})

router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    User.update(id, { name })
        .then(updated => {
            if(updated) {
                User.getById(id)
                    .then(user => res.status(200).json(user))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: "User not found"});
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error updating user"});
        });
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    User.getById(id)
        .then(user => {
            if(user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({error: "User does not exist"})
            }
        })
};

function validateUser(req, res, next) {
    const { name } = req.body;
    if(!name) {
        res.status(404).json({error: "Must have name"})
    }
    else if(!req.body) {
        res.status(404).json({error: "Must include data"})
    }
    next();
};

function validatePost(req, res, next) {
    
};

module.exports = router;
