import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    code: {type: String, required: true, maxLength: 16},
    title: {type: String,required: true, maxLength: 255},
    description: {type: String, required: false, maxLength: 2048},
    url: {type: String, required: false, maxLength: 512},
    student: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]
})

const Model = mongoose.model('Course', schema)

export default Model
