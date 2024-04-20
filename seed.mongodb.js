/* global use, db */
// MongoDB Playground
// This file is a playground for MongoDB commands - it creates the database and collections (using the play button but has no other functionality)

// Select the database to use.
use('tf_db')

db.users.drop()
db.listings.drop()

db.createCollection('users')
db.createCollection('listings')
