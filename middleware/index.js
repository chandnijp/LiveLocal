var Destination = require("../models/destination");
var Comment = require("../models/comment");
var Review = require("../models/review");


//all the middleware goes here
var middlewareObj = {};	


//------------------------------------------------------------------------------------------------------
middlewareObj.checkDestinationOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Destination.findById(req.params.id, function(err, foundDestination){
			if(err || !foundDestination){
				req.flash("error", "Destination not found.");
				res.redirect("back");
			} else {
				//does user own the post?
				if(foundDestination.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

//Check Destination Ownership:
//1)is the user logged in at all? 
//2)if they are not then redirect to "back" (eventually we will have an error message)
//3) If they are logged in then if foundDestination.author.id.equals(req.user._id) (note.. cannot do === as one is an object and the other is a string) then we move onto next which is whatever code that follows inside the route handler(code)



middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

//check destination ownership checks
//1) is the user logged in at all? 
//2)if they are not then redirect to "back" (eventually we will have an error message: please sign in and if they do sign in and dont own it we will send a different message)
//3) If they are logged in then find the comment and if foundComment.author.id.equals(req.user._id) (note.. cannot do === as one is an object and they other is a string) then we move onto next which is whatever code that follows inside the route handler(code)



middlewareObj.checkReviewOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Review.findById(req.params.review_id, function(err, foundReview){
			if(err || !foundReview){
				res.redirect("back");
			} else {
				//does user own the review?
				if(foundReview.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}



middlewareObj.checkReviewExistence = function(req, res, next){
	if(req.isAuthenticated()){
		Destination.findById(req.params.id).populate("reviews").exec(function(err, foundDestination){
			if(err || !foundDestination){
				req.flash("error", "Destination not found.");
				res.redirect("back");
			} else {
				//check if req.user._id exists in foundDestination.reviews
				var foundUserReview = foundDestination.reviews.some(function(review){
					return review.author.id.equals(req.user._id);
				});
				if(foundUserReview){
					req.flash("error", "You have already written a review.");
					return res.redirect("/destinations/" + foundDestination._id);	
				}
				//if the review was not found, go to the next middleware
				next();
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}



middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}



module.exports = middlewareObj