/*! MessageBoard 28-06-2013 */
var mongoose=require("mongoose"),bcrypt=require("bcrypt"),Schema=mongoose.Schema,SALT_WORK_FACTOR=10,userSchema=new Schema({name:{type:String,required:!0,unique:!0,index:!0},email:{type:String,required:!0,unique:!0},password:{type:String,required:!0},apikey:{type:String,required:!1,unique:!0},description:String,admin:{type:Boolean,required:!0,"default":!1},token:String,enabled:{type:Boolean,required:!0,"default":!1},UUID:String});userSchema.pre("save",function(a){var b;return b=this,b.isModified("password")?bcrypt.genSalt(SALT_WORK_FACTOR,function(c,d){return c?a(c):(b.apikey=generateAPIKey(),b.token=b.enabled?null:generateValidationToken(),bcrypt.hash(b.password,d,function(c,d){return c?a(c):(b.password=d,a(),void 0)}),void 0)}):a()}),userSchema.methods.comparePassword=function(a,b){return bcrypt.compare(a,this.password,function(a,c){return a?b(a):b(null,c)})},generateAPIKey=function(){var a;return a="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",generateRandomToken(32,a)},generateValidationToken=function(){var a;return a="1234567890",generateRandomToken(8,a)},generateRandomToken=function(a,b){var c,d,e,f;for(c=b.length,e="",f=0;a>f;)d=Math.floor(Math.random()*c),e+=b.charAt(d),f++;return e},User=mongoose.model("User",userSchema),User.schema.path("email").validate(function(a){return/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/.test(a)},"Invalid email"),module.exports=User;