import jwt from 'jsonwebtoken'
import { UserModel } from './db.js'

const adminAuth = async (req, res, next) => {
    try {
        // Complete auth check
        const authHeader = req.header('Authorization')
        if (!authHeader) {
            throw new Error('Authorization header is missing')
        }

        const token = authHeader.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await UserModel.findOne({ _id: decoded._id })

        if (!user) {
            throw new Error('User not found')
        }
        // If not admin, throw error
        if (!user.admin) {
            throw new Error('Access denied. Admin privileges required.')
        }

        req.user = user
        next()
    } catch (error) {
        res.status(403).send({ error: 'Access denied. Please authenticate as an admin.' })
    }
}

export default adminAuth