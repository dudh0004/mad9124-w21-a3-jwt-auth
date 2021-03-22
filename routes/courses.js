import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import { Course } from '../models/index.js'
import User from '../models/User.js'
import express from 'express'
import authUser from '../middleware/authUser.js'

const debug = createDebug('mad9124-w21-a3-jwt-auth:routes:courses')
const router = express.Router()

router.get('/', sanitizeBody, authUser, async (req, res) => {
    const course = await Course.find()
    res.send({data: course})
})

router.get('/:id', sanitizeBody, authUser, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('student')
    if (!course) {
        throw new Error('Resource not found')
    }
    res.send({data: course})
    } catch (err) {
        sendResourceNotFound(req, res);
    }
})

router.post('/', sanitizeBody, authUser, async (req, res) => {
    const user = await User.findById(req.user._id)
    try {
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        } 
        else if(user.isAdmin == false) 
        throw new Error ('You are not an admin user')
        const newCourse = new Course(req.sanitizedBody)
        await newCourse.save()
        res.send({data: newCourse})
        } catch (err) {
        sendResourceNotFound(err)
        }
})

router.patch('/:id', sanitizeBody, authUser, async (req, res) => {
    const {_id, id, ...otherAttributes} = req.sanitizedBody
    const user = await User.findById(req.user._id)

    try {
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        } 
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const course = await Course.findByIdAndUpdate(
        req.params.id, 
        {_id: req.params.id, ...otherAttributes}, 
        {
            new: true,
            runValidators: true
        }
        )
        if (!course) {
            throw new Error('Resource not found')
        }
        res.send({data: course})
        } catch (err) {
            sendResourceNotFound(req, res)
        }
})

router.put('/:id', sanitizeBody, authUser, async (req, res) => {
    const {_id, id, ...otherAttributes} = req.sanitizedBody
    const user = await User.findById(req.user._id)

    try {
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        } 
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const course = await Course.findByIdAndUpdate(
        req.params.id, 
        {_id: req.params.id, ...otherAttributes}, 
        {
            new: true,
            overwrite: true,
            runValidators: true
        }
    )
    if (!course) {
        throw new Error('Resource not found')
    }
    res.send({data: course})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.delete('/:id', sanitizeBody, authUser, async (req, res) => {
    const user = await User.findById(req.user._id)

    try { 
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        } 
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const course = await Course.findByIdAndRemove(req.params.id)
        if (!course) {
            throw new Error('Resource not found')
        }
        res.send({data: course})
        } catch (err) {
            sendResourceNotFound(req, res)
    }
})

function sendResourceNotFound(req, res) {
    res.status(404).send({
        errors: [
            {
                status: '404',
                title: 'Resource does not exist',
                description: `We could not find a Course with id: ${req.params.id}`
            }
        ]
    })
}

export default router