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
  purchased: [{type: Schema.Types.ObjectId,ref: 'courses'}]
});

userSchema.methods.addToCart = function (product) {

 this.purchased.push({product})
 return this.save()
};

function removefromCart(user,course) {
    console.log("tobedome")
}

function purchaseCourse(cuser,cid){
userSchema.findOne({username: cuser.username}).then((doc) => {
  if(!doc){       
      return false;
   } 
   
   else {
       coursesSchema.findOne({_id : cid}).then((purchased_course)=>{
           if(!purchased_course){
                   return false
               }
               else{
                   let purchased_arr = doc.purchased
                   if (myArray.includes(element)) {
                    console.log('The array contains the element');
                  }
                   
                   if (purchased_arr.includes(purchased_course._id)){
                    console.log('The array contains the element');
                    return false;
                  }

                  

                   purchased_arr.push(purchased_course._id)
                   userSchema.findByIdAndUpdate(doc._id, {purchased: purchased_arr},{new:true}).then((rslt) => {
                    if(cuser.wishlist.includes(purchased_course._id)){
                      removefromCart(cuser,purchased_course)
                  }
                  console.log(purchased_arr)
                  return true     
               })}

           })}
  })
}

module.exports =  mongoose.model('Users', userSchema);
