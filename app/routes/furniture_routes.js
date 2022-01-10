const express = require('express')
//json webtoken
const crypto = require('crypto')

const passport = require('passport')

const bcrypt = require('bcrypt')
const bccryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const Furniture = require('../models/furniture')
const furniture = require('../models/furniture')

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
router.post('/furniture', (req, res, next) => {
    Furniture.create(req.body.furniture)
    .then((furniture) =>{
        res.status(201).json({
            furniture: furniture.toObject()
        })
    })
    // if an error occurs, pass it to the handler
    .catch(next)

})
module.exports = router