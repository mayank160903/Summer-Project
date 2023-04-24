const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    name: {
        type: String
    },
    // name_of_instructor: {
    //     type: mongoose.ObjectId,
    //     ref: "instructor",
    // },
    category: {
        type: mongoose.ObjectId,
        ref: "category",
        
    },
    description: {
        type: String
    },
    price: {
        type: String
    },
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