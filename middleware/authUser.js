import jwt from 'jsonwebtoken'
const jwtSecretKey = 'superSecretKey'

const parseToken = function (headerValue) {
    if (headerValue) {
        const [type, token] = headerValue.split(' ')
        if (type === 'Bearer' && typeof token !== 'undefined'){
            return token
        }
    }
    
    return undefined
}

export default function (req, res, next) {
    // Get the JWT from the request header
    const headerValue = req.header('Authorization')
    const token = parseToken(headerValue) 

    if (!token) {
        return res.status(401).send({
            errors: [
                {
                    status: '401',
                    title: 'Authentication failed',
                    description: 'Missing bearer token',
                }
            ]
        })
    }
    // Validate the JWT
    try {
    const payload = jwt.verify(token, jwtSecretKey, { algorithms: ['HS256'] })
    req.user = { _id: payload.uid }
    next()
    } catch (err) {
        res.status(401).send({
            errors: [
                {
                    status: '401',
                    title: 'Authentication failed',
                    description: 'Invalid bearer token',
                }
            ]
        })
    }
}