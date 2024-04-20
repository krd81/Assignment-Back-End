import { Router } from "express"
import { ListingModel } from '../db.js'
import auth from '../auth.js'
import adminAuth from "../admin.js"
import moment from "moment"

// Initialize new router instance
const router = Router()
// PATHING FOR ROUTES: http://localhost:8003/listings

// Get all listings
router.get('/', auth, async (req, res) => {
    try {
      // Query DB for listings, populating applicants and creator within
      let listings = await ListingModel.find().populate('applicants').populate('creator');

      // If there are no listings, return an error
      if (!listings.length) {
          return res.status(404).send({error: 'No listings found'});
      }

      // Format dates for each listing
      listings = listings.map(listing => {
        const formattedListing = {
          ...listing.toObject(),
          datePosted: listing.datePosted ? moment(listing.datePosted).format('DD/MM/YYYY') : '',
          dateClosing: listing.dateClosing ? moment(listing.dateClosing).format('DD/MM/YYYY') : '',
        };
        return formattedListing;
      });

      // If there are listings, send them
      res.status(200).send(listings);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  })

// Get all listings for individual user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Query DB for listings, populating applicants and creator within
    let listings = await ListingModel.find({ creator: { _id: req.params.userId } }).populate('applicants').populate('creator');

    // If there are no listings, return an error
    if (!listings.length) {
        return res.status(404).send({error: 'No listings found'});
    }

    // Format dates for each listing
    listings = listings.map(listing => {
      const formattedListing = {
        ...listing.toObject(),
        datePosted: listing.datePosted ? moment(listing.datePosted).format('DD/MM/YYYY') : '',
        dateClosing: listing.dateClosing ? moment(listing.dateClosing).format('DD/MM/YYYY') : '',
      };
      return formattedListing;
    });

    // If there are listings, send them
    res.status(200).send(listings);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
})


// Get a single listing by ID
router.get('/:id', auth, async (req, res) => {
    try {
      // Query DB for a listing, populating applicants and creator within
      const listing = await ListingModel.findById(req.params.id).populate('applicants').populate('creator');

      // If it doesn't exist, return an error
      if (!listing) {
        return res.status(404).send({error: 'Listing not found'});
      }

      // Convert Mongoose document to a plain JavaScript object and format dates
      const formattedListing = {
        ...listing.toObject(),
        datePosted: listing.datePosted ? moment(listing.datePosted).format('DD/MM/YYYY') : '',
        dateClosing: listing.dateClosing ? moment(listing.dateClosing).format('DD/MM/YYYY') : '',
      };

      // If listing exists, send the formatted listing
      res.status(200).send(formattedListing);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  })

// Create new listing
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    // Create new listing in the DB using the request body
    const newListing = await (await ListingModel.create(req.body)).populate('creator')
    // Send new listing back to client
    res.status(201).send(newListing)
    // Handle errors within try/catch
  } catch (error) {
    res.status(400).send(error)
  }
})

// Update a listing by ID using PUT
router.put('/:id', auth, async (req, res) => {
  try {
    // Creator not required as this is not amendable
    // Update the listing of the specified request id
    const updatedListing = (await (await ListingModel.findByIdAndUpdate(req.params.id, req.body, {new : true})).populate('applicants'))
    // If update was successful, send back updated listing
    if (updatedListing) {
      res.status(200).send(updatedListing)
    // Else handle the error of missing listing
    } else {
      res.status(404).send({error: 'Listing not found'})
    }
    // Handle errors within try/catch
  } catch (error) {
    res.status(400).send({error: error.message})
  }
})


// Delete a listing by ID
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    // Creator not required as this is not amendable
    // Delete listing of the specified request id
    const deletedListing = await ListingModel.findByIdAndDelete(req.params.id)
    // If deletion is successful, send back successful status
    if (deletedListing) {
        // Changed to 200 so message can be received after deletion
        res.status(200).send({ message: "listing successfully deleted"})
    // Else handle error of missing listing
    } else {
        res.status(404).send({error: 'Listing not found'})
    }
    // Handle errors within try/catch
  } catch (error) {
    res.status(500).send({error: error.message})
  }
})


export default router