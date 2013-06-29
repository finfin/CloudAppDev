/*
 * GET home page.
 */
var apn = require('../util/apnhandler');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var log4js = require('log4js');
var logger = log4js.getLogger();

exports.index = function(req, res) {
    var pageSize = 10;
    var query = {
        $or: [{
                type: "public"
            }
        ]
    };
    if (req.user) {
        query.$or.push({
            user: req.user.name
        });
        query.$or.push({
            target: req.user.name
        });
    }

    if (req.query.name) {
        query.user = req.query.name;
    }

    Message.find(query).limit(pageSize).skip(pageSize * (req.query.page - 1)).exec(function(err, messages) {
        if (err) {
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

exports.list = function(req, res) {
    console.log("list shown");
    //var pageSize = 10;
    var query = {
        $or: [{
                type: "public"
            }
        ]
    };
    if (req.user) {
        query.$or.push({
            user: req.user.name
        });
        query.$or.push({
            target: req.user.name
        });
    }

    if (req.query.name) {
        query.user = req.query.name;
    }

    Message.find(query).exec(function(err, messages) {
        if (err) {
            logger.error(err);
            res.send(500, "error");
            return;
        }
        res.send(messages);
    });
};

//1. req.query.page換頁
//2. req.query.name
exports.myMessage = function(req, res) {
    var pageSize = 10;
    //TODO: 從model取得message, 並以req.user篩選使用者
    Message.find({
        $or: [{
                user: req.user.name
            }, {
                target: req.user.name
            }
        ]
    }).limit(pageSize).skip(pageSize * (req.query.page - 1)).exec(function(err, messages) {
        if (err) {
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

exports.myMessageAPI = function(req, res) {
    var pageSize = 10;
    //TODO: 從model取得message, 並以req.user篩選使用者
    Message.find({
        $or: [{
                user: req.user.name
            }, {
                target: req.user.name
            }
        ]
    }).limit(pageSize).skip(pageSize * (req.query.page - 1)).exec(function(err, messages) {
        if (err) {
            logger.error(err);
            res.send(500, "error");
            return;
        }
        res.send(messages);
    });

};

exports.createMessage = function(req, res) {
    Message.create({
        user: req.user.name,
        text: req.body.text,
        type: req.body.type,
        target: req.body.target
    }, function(err, message) {
        if (err) {
            logger.error(err);
            res.send(500, "Message creation error");
            return;
        }

        if (message.type === "private") {
            User.findOne({
                name: message.target
            }, function(err, user) {
                if (err || !user) {
                    logger.error(err);
                    res.send(500, "error");
                    return;
                }
                if (user.UUID) {
                    apn.notification(user.UUID, message.text);
                }
                if (req.get('Referrer')) {
                    res.redirect(req.get('Referrer'));
                } else {
                    res.send(200, "created");
                }

            });
        } else {
            if (req.get('Referrer')) {
                res.redirect(req.get('Referrer'));
            } else {
                res.send(200, "created");
            }
        }
    });

};

exports.removeMessage = function(req, res) {
    var query = {
        _id: req.params.id,
    };
    if (req.user && !req.user.admin)
        query.user = req.user.name;
    console.log(query);
    Message.remove(query, function(err, messages) {
        if (err || !messages) {
            console.log(err);
            res.send(500, "Cant remove such message");
            return;
        }
        res.redirect(req.get('Referrer'));
    });

};