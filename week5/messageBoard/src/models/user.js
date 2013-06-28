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
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  token: String,
  enabled: {
    type: Boolean,
    required: true,
    default: false
  },
  UUID: String
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
    if (user.enabled) {
      user.token = null;
    } else {
      user.token = generateValidationToken();
    }
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

generateValidationToken = function() {
  var chars;

  chars = "1234567890";
  return generateRandomToken(8, chars);
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

User = mongoose.model('User', userSchema);

User.schema.path('email').validate(function(value) {
  return (/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/).test(value);
}, 'Invalid email');

module.exports = User;