const express = require('express')
//json webtoken
const crypto = require('crypto')

const passport = require('passport')

// const bcrypt = require('bcrypt')
// const bccryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// import Furniture model
const Furniture = require('../models/furniture')

// authenticate user
const requireToken = passport.authenticate('bearer', { session: false })


const router = express.Router()

// GET INDEX
router.get('/furniture', (req, res, next) => {
    Furniture.find()
        .then((furnitures) => {
            return furnitures.map((furniture) => furniture.toObject())
        })
        .then((furnitures) => res.status(200).json({furnitures: furnitures}))
        // if an error occurs, pass it to the handler
        .catch(next)
})

// POST
router.post('/furniture', requireToken, (req, res, next) => {
    req.body.furniture.owner = req.user.id
    Furniture.create(req.body.furniture)
    .then((furniture) =>{
        res.status(201).json({
            furniture: furniture.toObject()
        })
    })
    // if an error occurs, pass it to the handler
    .catch(next)

})

// SHOW
router.get('/furniture/:id', (req, res, next) => {
	Furniture.findById(req.params.id)
		.then(handle404)
		// respond with 200 status and found object
		.then((furniture) => res.status(200).json({ furniture: furniture.toObject() }))
		// passs errors to handler
		.catch(next)
})

// PATCH
router.patch('/furniture/:id', requireToken, (req, res, next) => {
    	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.furniture.owner

	Furniture.findById(req.params.id)
		.then(handle404)
		.then((furniture) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// requireOwnership(req, furniture)
			// pass the result of Mongoose's `.update` to the next `.then`
			return furniture.updateOne(req.body.furniture)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DELETE
router.delete('/furniture/:id', requireToken, (req, res, next) => {
    Furniture.findById(req.params.id)
        .then(errors.handle404)
        .then((furniture) => {
            errors.requireOwnership
            furniture.deleteOne()
        })
        // 204 if deletion successful
        .then(() => res.sendStatus(204))
        // pass errors to handler
        .catch(next)
})
module.exports = router