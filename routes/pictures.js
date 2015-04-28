var express = require('express');
var router = express.Router();

var PicturesC = require('../controllers/PicturesControl');
var UserC = require('../models/User');
var CommentC = require('../controllers/CommentControl');
var TagC = require('../controllers/TagControl');
var LikeC = require('../controllers/LikeControl');

var pictures = function(passport) {

    router.get('/:picture_id', function(req,res) {

        PicturesC.getPic(req.params.picture_id, function(err, pic) {
			if (err) {}
            else {
        		PicturesC.getComments(req.params.picture_id, function(err, comments) {
                    if (err) {console.log(err)}
                    else {
                        PicturesC.getTags(req.params.picture_id, function(error, tags) {
                            if (error) {
                            console.log(err)
                            }
                            else if (!tags) {
                                res.render('picture', {comment: comments, picture: pic, title: "picture", album: req.params.albumId});
                            }
                            else {
                                album= req.params.albumId;
                                res.render('picture', {comment: comments, picture: pic, title: "picture", album: req.params.albumId, tags: tags});
                            }
                        });
                    }
                });
            }
        });
    });

    router.post('/:picture_id/comment', function(req,res) {
        var commentData = {picture_id: req.params.picture_id, user_id: req.user[0][0].user_id, text: req.body.text};
        //var commentList = PicturesC.getComments(req.params.picture_id);

        //console.log(commentList);
        var userData = req.user[0][0];
        CommentC.create(req.user[0][0], commentData, function(err, callback) {
            if (err) { 
                res.redirect(
                    '/pic/' + callback.picture_id,  {
                        user: req.res.req.user[0][0], 
                        title: 'Picture', 
                        messages: req.flash('Error creating comment.')
                    });
            } else {
                res.redirect('/pic/' + callback.picture_id, { user: req.res.req.user[0][0], title: 'Picture'});
            }
        });
    });

    router.post('/:picture_id/tag', function (req, res) {
        TagC.create(req.params.picture_id, req.body.tag, function(err, callback) {
            if (err) {
                res.redirect(
                    '/pic/' + callback.picture_id, {
                        user: req.res.req.user[0][0],
                        title: 'Picture'
                    });
            } else {
                res.redirect('/pic/' + req.params.picture_id);
            }
        });
    });
        
    router.post('/:picture_id/like', function(req,res) {
        var likeData = {picture_id: req.params.picture_id, user_id: req.user[0][0].user_id};
        //var likeList = PicturesC.getComments(req.params.picture_id);

        //console.log(likeList);
        var userData = req.user[0][0];
        LikeC.create(req.user[0][0], likeData, function(err, callback) {
            if (err) { 
                res.redirect(
                    '/pic/' + callback.picture_id,  {
                        user: req.res.req.user[0][0], 
                        title: 'Picture', 
                        messages: req.flash('Error creating like.')
                    });
            } else {
                res.redirect('/pic/' + callback.picture_id, { user: req.res.req.user[0][0], title: 'Picture'});
            }
        });
    });

    return router;
}

module.exports = pictures;
