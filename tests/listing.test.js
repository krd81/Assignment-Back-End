import app from '../app.js'
import request from 'supertest'

// GET All Listings
describe("GET /listings route", () => {
    let response, token
  
    // Fetch the listings and log in before running the tests
    beforeAll(async () => {
        // Step 1: Log in to get the token
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })
        token = loginResponse.body.token 

        // Step 2: Use the token to make an authenticated request to fetch listings
        response = await request(app)
            .get('/listings')
            .set('Authorization', `Bearer ${token}`) 
    })
  
    describe("Status Code", () => {
      test("should return a 200 status for a successful request", () => {
        expect(response.status).toBe(200)
      })
    })
  
    describe("Content Type", () => {
      test("should have a content type of application/json", () => {
        expect(response.header['content-type']).toContain('application/json')
      })
    })
  
    describe("Response Body", () => {
      test("should return an array of listings", () => {
        expect(Array.isArray(response.body)).toBe(true)
      })
  
      test("Array isn't empty", () => {
        expect(response.body.length).toBeGreaterThan(0)
      })
  
      test("each listing should have essential properties", () => {
        const properties = ['title', 'description', 'department', 'location', 'roleType', 
        'roleDuration', 'salary', 'datePosted', 'dateClosing', 'listingStatus', 'applicants']
        properties.forEach(property => {
            expect(response.body[0]).toHaveProperty(property)
        })
      })
    })
})


describe("GET /listings/:id route", () => {
    let response, token
    let listingId = "65e40f4073a77c18cd0bb653"

    beforeAll(async () => {
        // Log in as route is Auth protected
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing'
        })

        token = loginResponse.body.token 
        // Make the authenticated request to the protected route
        response = await request(app)
            .get(`/listings/${listingId}`)
            .set('Authorization', `Bearer ${token}`) 
    })

    describe("Status Code", () => {
        test("should return a 200 status for a successful request", () => {
            expect(response.status).toBe(200)
        })
    })

    describe("Content Type", () => {
        test("should have a content type of application/json", () => {
            expect(response.header['content-type']).toContain('application/json')
        })
    })

    describe("Response Body", () => {
        test("should return a listing object", () => {
            expect(typeof response.body).toBe('object')
        })

        test("listing should have essential properties", () => {
            const properties = ['title', 'description', 'department', 'location', 'roleType', 
            'roleDuration', 'salary', 'datePosted', 'dateClosing', 'listingStatus', 'applicants']
            properties.forEach(property => {
                expect(response.body).toHaveProperty(property)
            })
        })
    })
})


// Create a new Listing
describe('POST /listings route', () => {
    let newListingData, response, token

    beforeAll(async () => {
        // Mock data for creating a new listing
        newListingData = {
            title: "Test Listing",
            description: {
                bulletPoints: ["Point 1", "Point 2"],
                fullText: "Full description of the listing."
            },
            department: "Engineering",
            location: "Remote",
            roleType: "Full-Time",
            roleDuration: "Permanent",
            salary: 50000,
            datePosted: new Date(),
            dateClosing: new Date(new Date().setDate(new Date().getDate() + 30)), 
            listingStatus: "Active",
        }

        // Log in as route is Auth protected
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })

        token = loginResponse.body.token 

        // Create new listing
        response = await request(app)
            .post('/listings')
            .set('Authorization', `Bearer ${token}`)
            .send(newListingData)
    })

    describe("Status Code", () => {
        test('Responds with 201 status code for successful creation', () => {
            expect(response.status).toBe(201)
        })
    })

    describe("Content Type", () => {
        test("should have a content type of application/json", () => {
            expect(response.header['content-type']).toContain('application/json')
        })
    })

    describe("Response Body", () => {
        test("should have all required fields", () => {
            const expectedProperties = ['title', 'description', 'department', 'location', 'roleType', 
                                        'roleDuration', 'salary', 'datePosted', 'dateClosing', 'listingStatus']
            expectedProperties.forEach(property => {
                expect(response.body).toHaveProperty(property)
            })
            expect(Array.isArray(response.body.applicants)).toBe(true)
        })

        test("matches the mock data for all provided fields", () => {
            expect(response.body.title).toEqual(newListingData.title)
            expect(response.body.description).toEqual(expect.objectContaining(newListingData.description))
            expect(response.body.department).toEqual(newListingData.department)
            expect(response.body.location).toEqual(newListingData.location)
            expect(response.body.roleType).toEqual(newListingData.roleType)
            expect(response.body.roleDuration).toEqual(newListingData.roleDuration)
            expect(response.body.salary).toEqual(newListingData.salary)
            expect(new Date(response.body.datePosted)).toEqual(expect.any(Date))
            expect(new Date(response.body.dateClosing)).toEqual(expect.any(Date))
            expect(response.body.listingStatus).toEqual(newListingData.listingStatus)
        })
    })

    afterAll(async () => {
        // Delete entry
        if (response.body._id) {
            await request(app)
                .delete(`/listings/${response.body._id}`)
                .set('Authorization', `Bearer ${token}`)
        }
    })
})


// Update a Listing
describe('PUT /listings/:id route', () => {
    let originalListingData, updatedListingData, listingId, response, token

    beforeAll(async () => {
        // Log in to auth protected route
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing' 
        })
        token = loginResponse.body.token 

        // Mock data for creating a new listing
        originalListingData = {
            title: "Original Listing",
            description: {
                bulletPoints: ["Original Point 1", "Original Point 2"],
                fullText: "Original full description of the listing."
            },
            department: "Original Department",
            location: "Original Location",
            roleType: "Part-Time",
            roleDuration: "Temporary",
            salary: 30000,
            datePosted: new Date(),
            dateClosing: new Date(new Date().setDate(new Date().getDate() + 15)), 
            newListing: true,
            listingStatus: "Active",
        }

        // Create a new listing to update
        const createResponse = await request(app)
            .post('/listings')
            .set('Authorization', `Bearer ${token}`)
            .send(originalListingData)

        listingId = createResponse.body._id

        // Data to update the listing with
        updatedListingData = {
            title: "Updated Listing",
            description: {
                bulletPoints: ["Updated Point 1", "Updated Point 2"],
                fullText: "Updated full description of the listing."
            },
            department: "Updated Department",
            location: "Updated Location",
            roleType: "Full-Time",
            roleDuration: "Permanent",
            salary: 60000, 
            dateClosing: new Date(new Date().setDate(new Date().getDate() + 30)), 
            newListing: false,
            listingStatus: "Inactive", 
        }

        // Update the listing
        response = await request(app)
            .put(`/listings/${listingId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedListingData)
    })

    describe("Status Code", () => {
        test('Responds with 200 status code for successful update', () => {
            expect(response.status).toBe(200)
        })
    })

    describe("Content Type", () => {
        test("should have a content type of application/json", () => {
            expect(response.header['content-type']).toContain('application/json')
        })
    })

    describe("Response Body", () => {
        test("should have all updated fields", () => {
            const expectedProperties = ['title', 'description', 'department', 'location', 'roleType',
                                        'roleDuration', 'salary', 'datePosted', 'dateClosing', 'listingStatus']
            expectedProperties.forEach(property => {
                expect(response.body).toHaveProperty(property)
            })
            // Compares body response fields to updatedListingData properties
            expect(response.body.title).toEqual(updatedListingData.title)
            expect(response.body.description).toEqual(expect.objectContaining(updatedListingData.description))
            expect(response.body.department).toEqual(updatedListingData.department)
            expect(response.body.location).toEqual(updatedListingData.location)
            expect(response.body.roleType).toEqual(updatedListingData.roleType)
            expect(response.body.roleDuration).toEqual(updatedListingData.roleDuration)
            expect(response.body.salary).toEqual(updatedListingData.salary)
            expect(new Date(response.body.dateClosing)).toEqual(expect.any(Date))
            expect(response.body.listingStatus).toEqual(updatedListingData.listingStatus)
        })
    })

    afterAll(async () => {
        // Delete the listing that was updated
        if (listingId) {
            await request(app)
                .delete(`/listings/${listingId}`)
                .set('Authorization', `Bearer ${token}`)
        }
    })
})


// Delete a Listing
describe('DELETE /listings/:id route', () => {
    let listingData, listingId, response, token

    beforeAll(async () => {
        // Mock data for creating a new listing
        listingData = {
            title: "Listing to Delete",
            description: {
                bulletPoints: ["Delete Point 1", "Delete Point 2"],
                fullText: "Description of the listing to be deleted."
            },
            department: "Deletion Department",
            location: "Deletion Location",
            roleType: "Temporary",
            roleDuration: "Contract",
            salary: 20000,
            datePosted: new Date(),
            dateClosing: new Date(new Date().setDate(new Date().getDate() + 10)),
            newListing: true,
            listingStatus: "Active",
        }

        // Log in 
        const loginResponse = await request(app).post('/login').send({
            email: 'adam@email.com', 
            password: 'fishing'
        })
        token = loginResponse.body.token 

        // Create new listing to delete
        const createResponse = await request(app)
            .post('/listings')
            .set('Authorization', `Bearer ${token}`)
            .send(listingData)
        listingId = createResponse.body._id

        // Delete the listing
        response = await request(app)
            .delete(`/listings/${listingId}`)
            .set('Authorization', `Bearer ${token}`)
    })

    describe("Status Code", () => {
        test('Responds with 204 status code for successful deletion', () => {
            expect(response.status).toBe(200)
        })
    })

    describe("Response Body", () => {
        test("should confirm deletion with a message", () => {
            expect(response.body).toHaveProperty("message")
            expect(response.body.message).toEqual(expect.stringContaining('listing successfully deleted'))
        })
    })
})