var mongoose = require("mongoose");


var reviewSchema = new mongoose.Schema({
	rating: {
		//Setting the field type
		type: Number,
		//making the star rating required
		required: "Please provide a rating (1-5 stars).",
		//Defining min and max values
		min: 1,
		max: 5,
		//Adding validation to see if the entry is an integer
		validate: {
			//validator accepts a function definition which it uses for validation
			validator: Number.isInteger,
			message: "{VALUE} is not an integer value."
		}
	},
	//review text
	text: {
		type: String
	},
	//review title
	title: {
		type: String
	},
	//author id and username fields
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	//destination associated with the review
	destination: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Destination"
	}
}, {
	//if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your Schema, the type assigned is Date
	timestamps: true	
});


module.exports = mongoose.model("Review", reviewSchema);