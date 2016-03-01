var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var Item = mongoose.model('Item');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'The Showcase'});
});

router.param('item', function (req, res, next, id) {
    var query = Item.findById(id);

    query.exec(function (err, item) {
        if (err) {
            return next(err);
        }
        if (!item) {
            return next(new Error('Could not find item'));
        }

        req.item = item;
        return next();
    });
});

router.get('/items', function (req, res, next) {
    Item.find(function (err, items) {
        if (err) {
            return next(err);
        }

        res.json(items);
    });
});

router.get('/items/:item', function (req, res) {
    req.item.populate('comments', function (err, item) {
        if (err) {
            return next(err);
        }

        res.json(item);
    });
});

router.post('/items', auth, function (req, res, next) {
    var item = new Item(req.body);
    item.author = req.payload.username;

    item.save(function (err, item) {
        if (err) {
            return next(err);
        }

        res.json(item);
    });
});

router.put('/items/:item/upvote', auth, function (req, res, next) {
    req.item.upvote(function (err, item) {
        if (err) {
            return next(err);
        }

        res.json(item);
    });
});

router.put('/items/:item/downvote', auth, function(req, res, next) {
    req.item.downvote(function(err, item){
        if (err) {
            return next(err);
        }

        res.json(item);
    });
});

router.post('/items/:item/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.item = req.item;
    comment.author = req.payload.username;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.item.comments.push(comment);
        req.item.save(function (err, item) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

router.get('/items/:item/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, comment) {
        if (err) {
            return next(err);
        }

        res.json(comment);
    });
});

router.put('/items/:item/comments/:comment/downvote', auth, function(req, res, next) {
    req.comment.downvote(function(err, comment){
        if (err) {
            return next(err);
        }

        res.json(comment);
    });
});

router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function (err) {
        if (err) {
            return next(err);
        }

        return res.json({token: user.generateJWT()});
    });
});

router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;