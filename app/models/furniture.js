const mongoose = require('mongoose')

const furnitureSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
        subcategory: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        dimensions: {
            type: [Number],
            required: true,
        },
        shape: {
            type: String,
            required: false
        },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Furniture', furnitureSchema)