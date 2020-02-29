var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	Destination 	= require("./models/destination"),
	Review	 		= require("./models/review"),
	User			= require("./models/user"),
	seedDB			= require("./seeds");



//REQUIRING ROUTES
var reviewRoutes 		= require("./routes/reviews"),
	destinationRoutes	= require("./routes/destinations"),
	indexRoutes 		= require("./routes/index");

	

//CONNECT TO DB
var url = process.env.DATABASE_URL || "mongodb://localhost:27017/travel_app";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongoose.connect("mongodb://localhost:27017/travel_app", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongoose.connect("mongodb+srv://chandnijp:<password>@cluster0-uy3sp.mongodb.net/LiveLocal?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});



//CONNECT APPS
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); 
//referring to the directory name the folder sits in
app.use(express.static(__dirname + "/public"));
//to delete and update etc (?_method=DELETE)
app.use(methodOverride("_method"));
//flash  for error and success alert messages
app.use(flash());
//use moment to get specific timing of posts and comments
app.locals.moment = require("moment");
// seedDB(); //Seed the DB



//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//APPS CALLED ON EVERY ROUTE
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



//USE 3 ROUTE FILES
app.use("/", indexRoutes);
app.use("/destinations", destinationRoutes);
app.use("/destinations/:id/reviews", reviewRoutes);



app.listen(3000, function(){
	console.log("Server has started!");
});