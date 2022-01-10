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