import { Router } from "express"
import bcrypt from 'bcrypt'
import { UserModel } from '../db.js'
import auth from '../auth.js'
import adminAuth from "../admin.js"

const router = Router()
// PATHING FOR ROUTES: http://localhost:8003/users

// Get all users
router.get('/', auth, async (req, res) => {
try {
    // Query to find all users
    const users = await UserModel.find().populate('applications')
    // If none are found, send an error
    if (!users) {
        return res.status(404).send({error: 'No users found'})
    }
    // Send all users to client
    res.status(200).send(users)
// Handle errors within try/catch
} catch (error) {
    res.status(500).send(error)
}
})

// Get a single user by ID (AUTH REQUIRED)
router.get('/:id', auth, async (req, res) => {
try {
    // Query to find one user using request parameters
    const user = await UserModel.findById(req.params.id)
    // If the user isn't found, return an 
    if (!user) {
        return res.status(404).send({error: 'User not found'})
    }
    // Send user to client
    res.status(200).send(user)
// Handle errors within try/catch
} catch (error) {
    res.status(500).send(error)
}
})


// Create a new user (AUTH REQUIRED)
router.post('/', auth, adminAuth, async (req, res) => {
try {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 8)
    // Create new user with request + hashed password
    const newUser = new UserModel({
        ...req.body,
        password: hashedPassword,
})
    // Save user to DB
    await newUser.save()
    // Send back new user and confirmation code
    res.status(201).send(newUser)
// Handle errors within try/catch  
} catch (error) {
    res.status(400).send(error)
}
})


// Update a user by ID using PUT (AUTH REQUIRED)
router.put('/:id', auth, async (req, res) => {
    // Save updated fields based on request body
    const updates = Object.keys(req.body)
    // Specify which fields can be updated
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'role', 'department', 'admin', 'aboutMe', 'applications']
    // Check if all requested updates are valid
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

// If updates aren't allowed, send back error
if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
}

try {
    // Find user using request parameter id
    const user = await UserModel.findById(req.params.id)
    // If user doesn't exist, send back an error
    if (!user) {
        return res.status(404).send({ error: "User doesn't exist" })
    }

    // If updating password, hash it before saving
    if (req.body.password) {
        // Hashing of password
        req.body.password = await bcrypt.hash(req.body.password, 8)
    }
    // Apply updates to user, maping over each update
    updates.forEach((update) => user[update] = req.body[update])
    // Save user to DB
    await user.save()
    // Send back updated user
    res.send(user)
// Handle errors within try/catch  
} catch (error) {
    res.status(400).send(error)
}
})

// Delete a user by ID (AUTH REQUIRED)
router.delete('/:id', auth, adminAuth, async (req, res) => {
try {
    // Find user by request parameters
    const user = await UserModel.findByIdAndDelete(req.params.id)
    // If user isn't found, send error
    if (!user) {
        return res.status(404).send({ error: "User doesn't exist" })
    }
    // Send user for deletion
    res.status(204).send(user)
// Handle errors within try/catch  
} catch (error) {
    res.status(500).send(error)
}
})

export default router