var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Destination = require("../models/destination");
var middleware = require("../middleware");



//ROOT ROUTE
router.get("/", function(req, res){
	res.render("landing");
});



//SHOW REGISTER FORM
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});



//HANDLE SIGNUP LOGIC
router.post("/register", function(req, res){
	var newUser = new User({
			username: req.body.username, 
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			avatar: req.body.avatar,
			aboutMe: req.body.aboutMe,
		});
	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
   			console.log(err);
    		return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully signed up. Nice to meet you " + req.body.username + "!");
			res.redirect("/destinations");
		});
	});
});


//EDIT REGISTER FORM
router.get("/users/:id/edit", middleware.isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		res.render("/users/edit", {user: foundUser});
	});
});


//UPDATE USER PROFILE
router.put("/users/:id", middleware.isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.params.id, function(err, updatedUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("/");
		} else {
			req.flash("success", "Successfully updated!");
			res.redirect("/users/" + req.params.id);
		}
	});
});



//SHOW LOGIN FORM
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});



//HANDLE LOGIN LOGIC (app.post("/login", middleware, callback))
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/destinations",
		failureRedirect: "/login"
	}), function(req, res){
});



//LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/destinations");
});



//USER PROFILES ROUTE
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err) {
			req.flash("error", "Something went wrong!");
			res.redirect("/");
		}
		Destination.find().where('author.id').equals(foundUser._id).exec(function(err, destinations){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, destinations: destinations});
		});
	});
});
	
	
		
module.exports = router;