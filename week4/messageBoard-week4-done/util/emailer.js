var emailer = require("nodemailer");
var fs = require("fs");
var _ = require("underscore");
var config = require("../config/mailer");

var Emailer = function (options, data) {
    this.options.mailOption = _.extend(config.mailOption, options) || {};
    console.log(this.options);
    this.data = data || {};
    this.attachments = [];
}

Emailer.prototype.options = config;
Emailer.prototype.send = function(callback) {
    var attachments, html, messageData, transport;

    this.options.mailOption.html = this.getHtml();
    transport = this.getTransport();
    return transport.sendMail(this.options.mailOption, callback);
};

Emailer.prototype.getTransport = function() {
    return emailer.createTransport("SMTP", this.options.smtpOption);
};

Emailer.prototype.getHtml = function() {
    var encoding, templateContent, templatePath;
    var templateName = this.options.mailOption.template;

    templatePath = "./views/emails/" + templateName + ".html";
    templateContent = fs.readFileSync(templatePath, "utf8");
    return _.template(templateContent, this.data, {
        interpolate: /\{\{(.+?)\}\}/g
    });
};


exports = module.exports = Emailer;
