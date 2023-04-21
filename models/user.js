const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema({
  
  fullname: {type: String,required: true},
  username: { type: String, required: true},
  email: { type: String, required: true },
  phone: { type: Number, required: true},
  password: { type: String, required: true },
  wishlist: {type: Array, required: false}
});


module.exports =  mongoose.model('Users', userSchema);