var express = require("express");
//merge params from the destination and the comments together. So we can access :id
var router = express.Router({mergeParams:true});
var Destination = require("../models/destination");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find destination by id
	Destination.findById(req.params.id, function(err, destination){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {destination: destination});
		}
	});
});



//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup destinations using ID
	Destination.findById(req.params.id, function(err, destination){
		if(err){
			console.log(err);
			res.redirect("/destinations");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect new comment to destination
					destination.comments.push(comment);
					destination.save();
					console.log(comment);
					//redirect to destination show page
					req.flash("success", "Successfully added comment!");
					res.redirect("/destinations/" + destination._id);
				}
			});
		}
	});
});



//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {destination_id: req.params.id, comment: foundComment});
		}
	});
});



//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/destinations/" + req.params.id);
		}
	});
});



//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/destinations/" + req.params.id);
		}
	});
});



module.exports = router;