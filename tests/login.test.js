import request from 'supertest'
import app from '../app.js'

describe('POST /login route', () => {
    // Test user
    const testCredentials = {
        // MUST be seeded, accurate user login details
        email: 'betty@email.com', 
        password: 'castle' 
    }

    test('Successful authentication returns a token', async () => {
        const response = await request(app).post('/login').send(testCredentials)

        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined()
    })

    test('Invalid credentials return a 401 status code', async () => {
        const wrongCredentials = { ...testCredentials, password: 'wrongPassword' }
        const response = await request(app).post('/login').send(wrongCredentials)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Invalid credentials')
    })
})