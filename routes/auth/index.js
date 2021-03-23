import User from '../../models/User.js'
import createDebug from 'debug'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import authUser from '../../middleware/authUser.js'
import express from 'express'
import loginAttempts from '../../models/login_attempts.js'


const debug = createDebug('mad9124-w21-a3-jwt-auth:auth')
const router = express.Router()

router.post('/users', sanitizeBody, async(req, res) => {
    try {
    const newUser = new User(req.sanitizedBody)

    const isExists = Boolean(await User.countDocuments({ email : newUser.email }))

    if(isExists) {
        return res.status(400).send({
            errors: [
                {
                    status: '400',
                    title: 'Validation Error',
                    detail: `Email address '${newUser.email}' is already registered.`,
                    source: { pointer: '/data/attributes/email' }
                }
            ]
        })
    }

    await newUser.save()
    res.status(201).send({ data: newUser })
    } catch (err) {
        debug(err)
        res.status(500).send({
            errors: [
                {
                    status: '500',
                    title: 'Server Error',
                    description: 'Problem saving document to the database',
                },
            ],
        })
    }
})

router.get('/users/me', authUser, async(req, res) => {
    req.user._id
    const user = await User.findById(req.user._id)
    res.send({ data: user })
})

router.post('/tokens', sanitizeBody, async(req, res) => {
    const {email, password} = req.sanitizedBody
    let didSucceed = null;
    const user = await User.authenticate(email, password)
        if (user) {
            didSucceed = true
        } else {
            didSucceed = false
        }
        const loginAttempt = {
            username: email,
            ipAddress: req.ip,
            didSucceed,
            createdAt: new Date(Date.now())
        }
        let newAttempt = new loginAttempts(loginAttempt)
        await newAttempt.save()
        
        if (!user) {
            return res.status(401).send({ errors: [
                {
                    status: '401',
                    title: 'Incorrect username or password.',
                },
            ],
        })
    }

    res.status(201).send({ data: { token: user.generateAuthToken() } })
})

export default router