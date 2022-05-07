const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');


const Repositories = require('../models/repositories');

const repositoryRouter = express.Router();

repositoryRouter.use(bodyParser.json()); // repo routing
/**
 * On navigating to home page it will fetch repositories from database
 *
 */
repositoryRouter.route('/')
.options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Repositories.find({})
        .populate('user')
        .then((repositories) => {
            console.log(req.user.id);
            // find repositories that match the req.user.id
            // else return error message
            if (repositories) {
                user_repositories = repositories.filter(repo => repo.user._id.toString() === req.user.id.toString());

                user_repositories = repositories.filter(repo => repo.user._id.toString() === req.user.id.toString()); // fetching repositories

                if(!user_repositories) { // when there is no repositories
                    var err = new Error('You have no repositories!');
                    err.status = 404;
                    return next(err);

                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(user_repositories);
            } else { // when there is no repositories
                var err = new Error('There are no repositories');
                err.status = 404;
                return next(err);
            }
            
        }, (err) => next(err))
        .catch((err) => next(err));
})
 /**
  * Adding new repositories
  */
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Repositories.create(req.body)
    .then((repository) => {
        repository.user = req.user._id;
        repository.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(repository);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // updating repositories **yet to be implemented**
    res.statusCode = 403;
    res.end('PUT operation is not supported on /repositories');
})
    // delete existing repository if available
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // Delete repository on DELETE Method call
    Repositories.find({})
        .populate('user')
        .then((repositories) => {
            var repoToRemove;
            if (repositories) {
                repoToRemove = repositories.filter(repo => repo.user._id.toString() === req.user.id.toString());
            } 
            if(repoToRemove.length > 0 ){
                var ids_to_remove = [];
                repoToRemove.forEach(function(item) { // removing deleted repository
                    ids_to_remove.push(item._id);
                })
                Repositories.deleteMany({ _id: ids_to_remove })
                //repoToRemove.remove()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));
                
            } else {
                var err = new Error('You do not have any repositories');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

/**
 * navigating to the repo with the given repo id
 */

repositoryRouter.route('/:repositoryId')
.options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Repositories.findById(req.params.repositoryId)
    .populate('user')
    .then((repository) => {
        if (repository != null && repository.user._id.toString() != req.user.id.toString()) { // checking for permission
            
            err = new Error('You are not authorized to view this repository');
            err.status = 403;
            return next(err);
        }
            
        else if (repository == null) { // repo is not available
            err = new Error('Repository ' + req.params.repositoryId + ' not found');
            err.status = 404;
            return next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(repository);           
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => { // post operation based on repo id is not yet implemented
    res.statusCode = 403;
    res.end('POST operation not supported on /repositories/'+ req.params.repoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, // updating based on repo id
    (req, res, next) => {
        Repositories.find({})
            .populate('user')
            .then((repositories) => {
                var user;
                if(repositories){ // checking for repositories
                    user = repositories.filter(repo => repo.user._id.toString() === req.user.id.toString())[0];
                if(!user) { // when repo is not there
                    var err = new Error('You have no Repositories!');
                    err.status = 404;
                    return next(err);
                }
                Repositories.findByIdAndUpdate(req.params.repositoryId, { // find repo based on repo id and update it
                    $set: req.body
                }, { new: true })
                .populate('user')
                .then((repository) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(repository);
                }, (err) => next(err));
                
            }
            else{ // when repo doesn't exist
                var err = new Error('There are no repositories');
                err.status = 404;
                return next(err);
            }
                
                
            }, (err) => next(err))
            .catch((err) => next(err));
})
/**
 * delete repo based on repo id
 */
.delete(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
        Repositories.find({})
            .populate('user')
            .then((repositories) => {
                var user;
                if(repositories){ // check for repo based on id
                    user = repositories.filter(repo => repo.user._id.toString() === req.user.id.toString())[0];
                if(!user) {
                    var err = new Error('You have no Repositories!');
                    err.status = 404;
                    return next(err);
                }
                Repositories.findByIdAndRemove(req.params.repositoryId) // find the repo and delete it
                .populate('user')
                .then((repository) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(repository);
                }, (err) => next(err));
                
            }
            else{ // where there are no repos
                var err = new Error('There are no repositories');
                err.status = 404;
                return next(err);
            }
                
                
            }, (err) => next(err))
            .catch((err) => next(err));
})


//papers in particular repo based on repository id
repositoryRouter.route('/:repositoryId/papers')
.options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Repositories.findById(req.params.repositoryId)
    .populate('user')
    .then((repository) => { // searching for repo based on repo id and its permission
        if (repository != null && repository.user._id.toString() != req.user.id.toString()) {
            
            err = new Error('You are not authorized to view this repository');
            err.status = 403;
            return next(err);
        }
         // when not authorized
        else if (repository == null) {
            err = new Error('Repository ' + req.params.repositoryId + ' not found');
            err.status = 404;
            return next(err);
        }
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(repository.papers);           
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // adding a paper to a repo based on repo id
    Repositories.findById(req.params.repositoryId)
    .populate('user')
    .then((repository) => {
        if (repository != null) {
            req.body.repo = req.params.repositoryId;
            req.body.user = req.user._id;
            repository.papers.push(req.body)
            repository.save()
            .then((repository) => {
                Repositories.findById(repository._id)
                .populate('papers.user') // adding the paper
                .then((repository) => {
                    paper = repository.papers.id(repository.papers[repository.papers.length-1]._id)
                    console.log(paper);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(paper);
                })            
            }, (err) => next(err));
        }
        else { // when repo is not available
            err = new Error('Repository ' + req.params.repositoryId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})



module.exports = repositoryRouter;
