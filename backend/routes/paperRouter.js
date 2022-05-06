const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');


const Papers = require('../models/papers');

const paperRouter = express.Router();
 
paperRouter.use(bodyParser.json());

paperRouter.route('/')
.options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Papers.find({})
    .populate('owner')
    .then((papers) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(papers);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Papers.create(req.body)
    .then((paper) => {
        console.log('Paper Created ', paper);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(paper);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /papers');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Papers.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


paperRouter.route('/:paperId')
.options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Papers.findById(req.params.paperId)
    .populate('owner')
    .then((paper) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(paper);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /papers/'+ req.params.paperId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Papers.findByIdAndUpdate(req.params.paperId, {
        $set: req.body
    }, { new: true })
    .then((paper) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(paper);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Papers.findByIdAndRemove(req.params.paperId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = paperRouter;

