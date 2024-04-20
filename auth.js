import jwt from 'jsonwebtoken'
import { UserModel } from './db.js'

const auth = async (req, res, next) => {
    try {
        // Extract auth header from incoming request
        const authHeader = req.header('Authorization')
        // If auth header is empty, throw an error
        if (!authHeader) {
            throw new Error('Authorization header is missing')
        }

        // Extract token and remove 'Bearer' prefix, replacing it with an empty string
        const token = authHeader.replace('Bearer ', '')
        // Unwind token using token
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        // Find user matching decoded _id in DB
        const user = await UserModel.findOne({ _id: decoded._id })

        // If user isn't found, throw an error
        if (!user) {
        throw new Error()
        }

        // Assign req.user to user for future middleware reference
        req.user = user
        // Continue to next middleware
        next()

    } catch (error) {
        // Log the error

        // Send JSON error response
        res.status(401).send({ error: 'Please authenticate.' })
    }
  }

export default auth