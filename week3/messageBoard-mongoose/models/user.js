var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 10;

// USER欄位
// name: 字串、必填、唯一
// email: 字串、必填、唯一
// password: 字串、必填
// description: 字串
var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    description: String
});

/**
 * 先把密碼加密再放進資料庫
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
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
        //user.password = bcrypt.hashSync(user.password, salt);
        //return next();
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

var User = mongoose.model('User', userSchema);


/**
 * email格式檢查，檢查的regexp可以參考week1講義
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
User.schema.path('email').validate(
    // TODO:
    // 參數1：檢查函式
    // 參數2：錯誤字串
);