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
    seedDB = require("./seeds");

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

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX list of all
app.get("/flowertypes", function(req, res){
   Flowertype.find({}, function(err, allFlowertypes){
       if(err){
           console.log(err);
       }else{
            res.render("flowertypes/index", {flowertypes:allFlowertypes, currentUser: req.user});
       }
   });
});

//CREATE add new to DB
app.post("/flowertypes", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newFlowertype = {name:name, image:image, description:desc};
   Flowertype.create(newFlowertype, function(err, newlyCreated){
    if(err){
        console.log(err);
    }else{
        res.redirect("/flowertypes");
    }
   });
});

//NEW show form to create new
app.get("/flowertypes/new", function(req, res){
    res.render("flowertypes/new");
});

app.get("/flowertypes/:id", function(req,res){
    Flowertype.findById(req.params.id).populate("comments").exec(function(err, foundFlowertype){
        if(err){
            console.log(err);
        }else{
            res.render("flowertypes/show", {flowertype : foundFlowertype});
        }
    });
});

//COMMENTS
app.get("/flowertypes/:id/comments/new",isLoggedIn, function(req, res) {
    Flowertype.findById(req.params.id, function(err, flowertype){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {flowertype: flowertype});
       }
    })
});

app.post("/flowertypes/:id/comments", isLoggedIn, function(req, res) {
    Flowertype.findById(req.params.id, function(err, flowertype){
        if(err){
            console.log(err);
            res.redirect("/flowertypes");
        } else{
            Comment.create(req.body.comment, function (err, comment) {
                if(err){
                    console.log(err);
                }else{
                    flowertype.comments.push(comment);
                    flowertype.save();
                    res.redirect("/flowertypes/" + req.params.id);
                }
            });
        }
     })
});

//auth routes
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/flowertypes");
        });
    });
});

//login
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login",passport.authenticate("local", 
    {successRedirect:"/flowertypes",
    failureRedirect: "/login"
    }), 
    function(req, res) {
});

app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/flowertypes"); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

app.listen(port, function(){
    console.log("START");
});