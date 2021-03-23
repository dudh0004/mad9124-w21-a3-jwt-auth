import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const jwtSecretKey = 'superSecretKey'
const saltRounds = 14

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true, required: true, maxLength: 64 },
    lastName: { type: String, trim: true, required: true, maxLength: 64 },
    email: { type: String, trim: true, required: true, unique: true, maxLength: 512 },
    password: { type: String, trim: true, required: true, maxLength: 70 },
    isAdmin: {type:Boolean, default: false, required: true }
})

schema.methods.generateAuthToken = function () {
    const payload = { uid: this._id }
    return jwt.sign(payload, jwtSecretKey, { expiresIn: '1h', algorithm: 'HS256' })
}

schema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

schema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email: email })

    const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
    const hashedPassword = user ? user.password : badHash
    const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

    return passwordDidMatch ? user : null
}

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
})

const Model = mongoose.model('User', schema) 

export default Model