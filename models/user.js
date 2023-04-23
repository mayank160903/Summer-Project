const mongoose = require('mongoose');
const courseSchema = require(__dirname + "/course.js");
const Schema = mongoose.Schema;


const userSchema = new Schema({
  
  fullname: {type: String,required: true},
  username: { type: String, required: true},
  email: { type: String, required: true },
  phone: { type: Number, required: true},
  password: { type: String, required: true },
  wishlist: [{type: Schema.Types.ObjectId,ref: 'courses'}],
});

userSchema.methods.addToCart = function (product) {
  const cartProductIdx = this.wishlist.findIndex(cp => cp.toString() === product._id.toString());

  
  const updateCartItems = [...this.wishlist];

  if (cartProductIdx > -1) {
    console.log("Already in Cart")
  } else {
    updateCartItems.push({ wishlist: product._id});
  }

  this.wishlist = updateCartItems
  return this.save();
};


module.exports =  mongoose.model('Users', userSchema);
