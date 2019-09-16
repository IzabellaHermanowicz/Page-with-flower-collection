let express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Flowertype = require("./models/flowertype"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    commentRoutes = require("./routes/comments"),
    flowertypeRoutes = require("./routes/flowertypes"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/flower_types_4", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//passport
app.use(require("express-session")({
    secret:"Emmecik mnie kocha przynajmniej mam nadzieje",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/flowertypes/:id/comments",commentRoutes);
app.use("/flowertypes",flowertypeRoutes);

app.listen(port, function(){
    console.log("START");
});