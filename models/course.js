const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const courseSchema = new Schema({
  category:{type: String, required: true},
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  teacher: [{type: Schema.Types.ObjectId, ref: 'teachers', required: true}], 
});

module.exports = mongoose.model('courses', courseSchema);