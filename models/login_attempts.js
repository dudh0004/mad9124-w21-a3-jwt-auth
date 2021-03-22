import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    username: { type: String, trim: true, required: true, maxLength: 64 },
    ipAddress: { type: String, trim: true, required: true, maxLength: 64 },
    didSucceed: {type: Boolean, required: true },
    createdAt: {type: Date, required: true }
})

const Model = mongoose.model('authentication_attempts', schema);

export default Model;