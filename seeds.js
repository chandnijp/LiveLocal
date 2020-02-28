var mongoose = require("mongoose");
var Destination = require("./models/destination");
var Comment = require("./models/comment");


var data = [
		{
			name: "Dominican Republic",
			image: "https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581_1280.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{
			name: "Myanmar", 
			image: "https://cdn.pixabay.com/photo/2016/01/13/01/36/bagan-1137015_1280.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{
			name: "Abu Dhabi", 
			image: "https://cdn.pixabay.com/photo/2015/01/28/23/10/mosque-615415_1280.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
	]
	
	
function seedDB() {
	//remove all destinations
	Destination.deleteMany({}, function(err) {
		if(err){
			console.log(err);
		}
		console.log("removed destinations!");
		//add a few destinations
		data.forEach(function(seed){
			Destination.create(seed, function(err, destination){
				if(err){
					console.log(err);
				} else {
					console.log("added a destination");
					//create a comment on each destination
					Comment.create(
						{
							text: "This place is great but I wish there was internet",
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								destination.comments.push(comment);
								
destination.save();
								
console.log("Created a new comment");
							}
						});
				}
			});
		});
	});
}
	
	module.exports = seedDB;