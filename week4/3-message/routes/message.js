/*
 * GET home page.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var log4js = require('log4js');
var logger = log4js.getLogger();

exports.index = function(req, res) {
    var pageSize = 10;
    
    //TODO: add query

    Message.find(query).limit(pageSize).skip(pageSize*(req.query.page-1)).exec(function(err, messages) {
        if(err) {
            logger.error(err);
            res.send(500, "error");
            return;
        }
        res.render('index', {
            title: 'Message Board',
            messages: messages || [],
            user: req.user
        });
    });
};

exports.myMessage = function(req, res) {
    var pageSize = 10;
    Message.find({
        //TODO: add query
    }).limit(pageSize).skip(pageSize*(req.query.page-1)).exec(function(err, messages) {
        if(err) {
            logger.error(err);
            res.send(500, "error");
            return;
        }
        res.render('index', {
            title: 'My Message Board',
            messages: messages || [],
            user: req.user
        });
    });

};

exports.createMessage = function(req, res) {
    Message.create({
        user: req.user.name,
        text: req.body.text,
        //TODO: add extra fields
    }, function(err, message) {
        if (err) {
            logger.error(err);
            res.send(500, "Message creation error");
            return;
        }
        res.redirect(req.get('Referrer'));
    })

};

exports.removeMessage = function(req, res) {
    Message.remove({
        _id: req.params.id
    }, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "Message operation error");
            return;
        }
        res.redirect(req.get('Referrer'));
    });

};