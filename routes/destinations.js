var express = require("express");
var router = express.Router()
var Destination = require("../models/destination");
var Review = require("../models/review");
//dont have to specify index.js as automatically looks for a file called index.js which the mw folder has
var middleware = require("../middleware");



//INDEX - show all destinations
router.get("/", function(req, res) {
//Get all destinations from DB, then run the code, if error, print error. Otherwise take "allDestinations" that just came back and save them to the campgrounds.ejs file
	Destination.find({}, function(err, allDestinations) {
		if(err) {
			console.log(err);
		} else {
			res.render("destinations/index", {destinations: allDestinations, page: 'destinations'});
		}
	});
});



//CREATE - add new destination to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
	//get data from form and add to destination array
	var name = req.body.name;
	var image = req.body.image;
	var cost = req.body.cost;
	var loc = req.body.location;
	var summ = req.body.summary;
	var desc = req.body.description;
	var neigh = req.body.neighbourhood;
	//display author when adding a destination
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newDestination = {name: name, image: image, cost: cost, location: loc, summary: summ, description: desc, neighbourhood: neigh, author: author};
	//Create a new destination and save to DB
	Destination.create(newDestination, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to destinations page
			res.redirect("/destinations");
		}
	});
});



//NEW - show form to create new destination
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("destinations/new");
});



//SHOW - shows more info about one destination
router.get("/:id", function(req, res){
	//find the destination with provided ID
	Destination.findById(req.params.id).populate("reviews").populate({
		path: "reviews",
		options: {sort: {createdAt: -1}}
	}).exec(function(err, foundDestination){
		if(err){
			console.log(err);
		} else {
			//render show template with that destination
			res.render("destinations/show", {destination: foundDestination});
		}
	});
});



//EDIT DESTINATION ROUTE
router.get("/:id/edit", middleware.checkDestinationOwnership, function(req, res){
	Destination.findById(req.params.id, function(err, foundDestination){
		res.render("destinations/edit", {destination: foundDestination});
	});
});



//UPDATE DESTINATION
router.put("/:id", middleware.checkDestinationOwnership, function(req, res){
	delete req.body.destination.rating;
	//find and update the correct destination
	Destination.findByIdAndUpdate(req.params.id, req.body.destination, function(err, updatedDestination){
		if(err){
			req.flash("error", err.message);
			res.redirect("/destinations");
		} else {
			req.flash("success", "Successfully Updated!");
			//redirect somewhere else (show page)
			res.redirect("/destinations/" + req.params.id);
		}
	});
});



//DESTROY DESTINATION
router.delete("/:id", middleware.checkDestinationOwnership, function(req, res){
	Destination.findById(req.params.id, function(err, destination){
		if(err){
			res.redirect("/destinations");
		} else {
			//deletes all comments associated with the destination
			Review.remove({"_id": {$in: destination.reviews}}, function(err){
				if(err){
					console.log(err);
					return res.redirect("/destinations");
				}
				//delete the destination
				destination.remove();
				req.flash("success", "Destination deleted successfully!");
				req.redirect("/destinations");
			});
		}
	});
});



module.exports = router;