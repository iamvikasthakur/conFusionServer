const express = require('express');
const Router = express.Router();
const authenticate = require('../authenticate');
const Favourites = require('../models/favourite');

Router.use(express.json());

Router.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favdishes) => {
        if(favdishes){
            console.log(favdishes);
            res.statusCode = 200;
            res.json(favdishes);
        }
        else{
            res.send({"info":"you don't have favourite dishes"});
        }
    })
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .then((favdish) => {
        console.log(favdish);
        if(!favdish){
            var dishes = [];
            for(var i = 0; i < req.body.length; i++){
                dishes.push(req.body[i]._id);
            }
            var dish = {
                user : req.user._id,
                dishes : dishes
            }
            console.log(dish);
            Favourites.create(dish)
            .then((favdish) => {
                console.log(favdish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favdish);
            })
            .catch(err => next(err));
        }
        else{
            var count = 0;
            for(var i = 0; i < req.body.length; i++){
                if(favdish.dishes.indexOf(req.body[i]._id) == -1){
                    favdish.dishes.push(req.body[i]._id);
                }
                else{
                    count++;
                }
            }
            console.log(count);
            favdish.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            })
            .catch(err => next(err));
            if(count){
                res.send({"info":"you have " + count + " dish(s) already in your favourite dish list"})
            }
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .then((favdish) => {
        if(favdish){
            favdish.remove({});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.send(favdish);
        }
        else{
            res.statusCode = 200;
            res.send({"info": "no favourite dish"});
        }
    })
    .catch((err) => next(err));
});

Router.route('/:favdishId')
.post(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .then((favdish) => {
        console.log(favdish);
        if(!favdish){
            var dish = {
                user : req.user._id,
                dishes : [req.params.favdishId]
            }
            console.log(dish);
            Favourites.create(dish)
            .then((favdish) => {
                console.log(favdish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favdish);
            })
            .catch(err => next(err));
        }
        else{
            if(favdish.dishes.indexOf(req.params.favdishId) == -1){
                favdish.dishes.push(req.params.favdishId);
                console.log(favdish);
                favdish.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
                .catch(err => next(err));
            }
            else{
                res.send({"info":"you have this dish already in your favourite dish list"})
            }
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .then((favdish) => {
        if(favdish){
            var dishes = [];
            for(var i = 0; i < favdish.dishes.length; i++){
                if(favdish.dishes[i] != req.params.favdishId){
                    dishes.push(favdish.dishes[i]);
                }
            }
            favdish.dishes.remove();
            favdish.dishes = dishes;
            favdish.save()
            .then(favdish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.send(favdish);
            })
        }
        else{
            res.statusCode = 200;
            res.send({"info": "no favourite dish"});
        }
    })
    .catch((err) => next(err));
});




module.exports = Router;