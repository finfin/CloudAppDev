var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 10;
var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apikey: {
      type: String,
      required: false,
      unique: true
    },
    description: String,
    //TODO: add admin field
});

userSchema.pre('save', function(next) {
    var user;

    user = this;
    if (!user.isModified("password")) {
        return next();
    }
    return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }
        user.apikey = generateAPIKey();
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();

        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  return bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

generateAPIKey = function() {
  var chars;

  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  return generateRandomToken(32, chars);
};

generateRandomToken = function(len, chars) {
  var charLen, i, token, x;

  charLen = chars.length;
  token = '';
  x = 0;
  while (x < len) {
    i = Math.floor(Math.random() * charLen);
    token += chars.charAt(i);
    x++;
  }
  return token;
};

var User = mongoose.model('User', userSchema);

User.schema.path('email').validate(function(value) {
    return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/.test(value);
}, 'Invalid email');