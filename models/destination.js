var mongoose = require("mongoose");
var Comment = require("./comment");
var Review = require("./review");


//SCHEMA SETUP
var destinationSchema = new mongoose.Schema({
	name: String,
	image: String,
	summary: String,
	description: String,
	neighbourhood: String,
	cost: Number,
	location: String,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	],
	rating: {
		type: Number,
		default: 0
	}
});

//Compile the Schema into a model (we can use DB terms e.g. find())
// var Destination = mongoose.model("Destination", destinationSchema);

module.exports = mongoose.model("Destination", destinationSchema);