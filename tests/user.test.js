import request from 'supertest'
import app from '../app.js'

describe('GET /users', () => {
    let response, token

    beforeAll(async () => {
        // Log in to obtain an authentication token
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })
        token = loginResponse.body.token // Store the token

        // Make the authenticated request to get all users
        response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
    })

    test('should return a 200 status for a successful request', () => {
        expect(response.status).toBe(200)
    })

    test('should return an array of users', () => {
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThan(0)
    })

    test('each user should have essential properties', () => {
        const properties = ["_id", "firstName", "lastName", "email", "role", "department"]
        properties.forEach(property => {
            expect(response.body[0]).toHaveProperty(property)
        })
    })
})


// GET One User
describe('GET /users/:id', () => {
    let response
    // MUST be with seeded userId
    const userId = "65e40f3f73a77c18cd0bb64c"
    let token

    beforeAll(async () => {
        // Log in as route is Auth protected
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })

        token = loginResponse.body.token 
        // Step 2: Make the authenticated request to the protected route
        response = await request(app)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`) 
    })

    test('should return a 200 status for a successful request', () => {
        expect(response.status).toBe(200)
    })

    test('should return a user object with essential properties', () => {
        const properties = ["_id", "firstName", "lastName", "email", "role", "department"]
        properties.forEach(property => {
            expect(response.body).toHaveProperty(property)
        })
    })
})


// Create New User
describe('POST /users', () => {
    let newUser, response, createdUserId, token

    beforeAll(async () => {
        // Define new user data
        newUser = {
            firstName: "Mirage",
            lastName: "Voyage",
            email: "Dupped@decoy.com",
            password: "bamboozled",
            role: "user",
            department: "IT"
        }

        // Log in to auth-protected route
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })

        // Token for Auth requests
        token = loginResponse.body.token 

        // Authenticate
        response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`) 
            .send(newUser)

        // Store userId for afterAll cleanup
        if (response.body._id) {
            createdUserId = response.body._id
        }
    })

    test('Responds with 201 status code for successful creation', () => {
        expect(response.status).toBe(201)
    })

    // Delete created user
    afterAll(async () => {
        if (createdUserId) {
            // Ensure the deletion request is also authenticated if necessary
            await request(app)
                .delete(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${token}`)
        }
    }) 
})

// Update a User
describe('PUT /users', () => {
    let newUser, updatedUser, createUserResponse, updateResponse, token, createdUserId

    beforeAll(async () => {
        // Log in to obtain an authentication token
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })

        token = loginResponse.body.token

        // Create new user data
        newUser = {
            firstName: "Initial",
            lastName: "User",
            email: "initialuser@example.com",
            password: "initialPassword",
            role: "user",
            department: "HR"
        }

        // Create the user
        createUserResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
        createdUserId = createUserResponse.body._id

        // Updated user information
        updatedUser = {
            firstName: "Updated",
            lastName: "User",
            email: "updateduser@example.com",
            password: "updatedPassword",
            role: "user",
            department: "IT"
        }

        // Auth request to update user
        updateResponse = await request(app)
            .put(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser)
    })

    test('Responds with 201 status code for successful creation', () => {
        expect(createUserResponse.status).toBe(201)
    })

    test('Responds with 200 status code for successful update', () => {
        expect(updateResponse.status).toBe(200)
    })

    test('Response body contains updated properties', () => {
        expect(updateResponse.body.firstName).toEqual(updatedUser.firstName)
        expect(updateResponse.body.lastName).toEqual(updatedUser.lastName)
        expect(updateResponse.body.email).toEqual(updatedUser.email)
        expect(updateResponse.body.role).toEqual(updatedUser.role)
        expect(updateResponse.body.department).toEqual(updatedUser.department)

    })

    // Cleanup: delete the created/updated user
    afterAll(async () => {
        if (createdUserId) {
            await request(app)
                .delete(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${token}`)
        }
    })
})


// Delete user
describe('DELETE /users/:id', () => {
    let token, createdUserId

    beforeAll(async () => {
        // Log in to obtain an authentication token
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })

        token = loginResponse.body.token

        // Create new user data
        const newUser = {
            firstName: "Temp",
            lastName: "User",
            email: "tempuser@example.com",
            password: "tempPassword",
            role: "user",
            department: "IT"
        }
        const createUserResponse = await request(app)
            .post('/users').set('Authorization', `Bearer ${token}`)
            .send(newUser)
        createdUserId = createUserResponse.body._id
    })

    test('Deletes a user and returns a 204 status code', async () => {
        const response = await request(app)
            .delete(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(204)
    })

    // FIX THIS TEST
    test('Verifies the user has been deleted', async () => {
        const response = await request(app)
            .get(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(404)
    }) 


})