import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import { Student } from '../models/index.js'
import User from '../models/User.js'
import express from 'express'
import authUser from '../middleware/authUser.js'


const debug = createDebug('mad9124-w21-a3-jwt-auth:routes:students')
const router = express.Router()

router.get('/', sanitizeBody, authUser, async (req, res) => {
    const students = await Student.find()
    res.send({data: students})
})

router.get('/:id', sanitizeBody,  authUser, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student) {
            throw new Error('Resource not found')
        }
        res.send({data: student})
        } catch (err) {
            sendResourceNotFound(req, res);
        }
})

router.post('/', sanitizeBody,  authUser, async (req, res) => {
    const user = await User.findById(req.user._id)

    try {
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        }
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const newStudent = new Student(req.sanitizedBody)
        await newStudent.save()
        res.send({data: newStudent})
        } catch (err) {
        sendResourceNotFound(err)
        }
        
    })

router.patch('/:id', sanitizeBody,  authUser, async (req, res) => {
    const {_id, id, ...otherAttributes} = req.sanitizedBody
    const user = await User.findById(req.user._id)

    try { 
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        }
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const student1 = await Student.findById(req.params.id)
        console.log(student1);
        const student = await Student.findByIdAndUpdate(
        req.params.id, 
        {_id: req.params.id, ...otherAttributes}, 
        {
            new: true,
            runValidators: true
        })
    if (!student) {
        throw new Error('Resource not found')
    }
    res.send({data: student})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.put('/:id', sanitizeBody,  authUser, async (req, res) => {
    const {_id, id, ...otherAttributes} = req.sanitizedBody
    const user = await User.findById(req.user._id)

    try {
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        } 
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const student = await Student.findByIdAndUpdate(
        req.params.id, 
        {_id: req.params.id, ...otherAttributes}, 
        {
            new: true,
            overwrite: true,
            runValidators: true
        }
    )
    if (!student) {
        throw new Error('Resource not found')
    }
    res.send({data: student})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.delete('/:id', sanitizeBody,  authUser, async (req, res) => {
    const user = await User.findById(req.user._id)

    try { 
        if(!user)
        {
            throw new Error ('You are not Authorized.')
        } 
        else if(!user.isAdmin) 
        throw new Error ('You are not an admin user')

        const student = await Student.findByIdAndRemove(req.params.id)
        if (!student) {
            throw new Error('Resource not found')
        }
        res.send({data: student})
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
                description: `We could not find a Student with id: ${req.params.id}`
            }
        ]
    })
}

export default router