import mongoose from 'mongoose'
import createDebug from 'debug'
const debug = createDebug('mad9124-w21-a3-jwt-auth:db')

export default function () {
    mongoose
        .connect('mongodb://localhost:27017/crud', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        })
        .then(() => {
            debug('Successfully connected to MongoDB ...')
        })
        .catch((err) => {
            debug('Error connecting to MongoDB ... ', err.message)
            process.exit(1)
        })
}
