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




// paperRouter.route('/:dishId/comments')
// .options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
// .get(cors.cors, (req,res,next) => {
//     Dishes.findById(req.params.dishId)
//     .populate('comments.author')
//     .then((dish) => {
//         if (dish != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(dish.comments);
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null) {
//             req.body.author = req.user._id;
//             dish.comments.push(req.body);
//             dish.save()
//             .then((dish) => {
//                 Dishes.findById(dish._id)
//                 .populate('comments.author')
//                 .then((dish) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(dish);
//                 })            
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /dishes/'
//         + req.params.dishId + '/comments');
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null) {
//             for (var i = (dish.comments.length -1); i >= 0; i--) {
//                 dish.comments.id(dish.comments[i]._id).remove();
//             }
//             dish.save()
//             .then((dish) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(dish);                
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));    
// });

// dishRouter.route('/:dishId/comments/:commentId')
// .options(cors.corsWithOptions,(req,res) => { res.sendStatus(200); })
// .get(cors.cors, (req,res,next) => {
//     Dishes.findById(req.params.dishId)
//     .populate('comments.author')
//     .then((dish) => {
//         if (dish != null && dish.comments.id(req.params.commentId) != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(dish.comments.id(req.params.commentId));
//         }
//         else if (dish == null) {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('Comment ' + req.params.commentId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/'+ req.params.dishId
//         + '/comments/' + req.params.commentId);
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null && dish.comments.id(req.params.commentId) != null) {
//             if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
//                 err = new Error('You are not authorized to edit this comment');
//                 err.status = 403;
//                 return next(err);
//             }
//             if (req.body.rating) {
//                 dish.comments.id(req.params.commentId).rating = req.body.rating;
//             }
//             if (req.body.comment) {
//                 dish.comments.id(req.params.commentId).comment = req.body.comment;                
//             }
//             dish.save()
//             .then((dish) => {
//                 Dishes.findById(dish._id)
//                 .populate('comments.author')
//                 .then((dish) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(dish);  
//                 })              
//             }, (err) => next(err)).catch((err) => next(err));
//         }
//         else if (dish == null) {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('Comment ' + req.params.commentId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null && dish.comments.id(req.params.commentId) != null) {
//             if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
//                 err = new Error('You are not authorized to delete this comment');
//                 err.status = 403;
//                 return next(err);
//             }
//             dish.comments.id(req.params.commentId).remove();
//             dish.save()
//             .then((dish) => {
//                 Dishes.findById(dish._id)
//                 .populate('comments.author')
//                 .then((dish) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(dish);  
//                 })               
//             }, (err) => next(err));
//         }
//         else if (dish == null) {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('Comment ' + req.params.commentId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });



module.exports = paperRouter;

