const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    teacher: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'teacher', required: true
    }],

    category: {
        type: mongoose.ObjectId,
        ref: "category",
        
    },
    description: {
        type: String,
        required: true,

    },
    
    price: {
        type: String,
        required: true,
    },

    imageUrl: { 
        type: String, 
        required: true },

    sections: [
        {
            section_name: {
                type: String
            },
            videos: [
                {
                    video_name: {
                        type: String
                    },
                    video_url: {
                        type: String
                    },
                }
            ]
        }
    ]
})

module.exports = mongoose.model("courses", courseSchema);
