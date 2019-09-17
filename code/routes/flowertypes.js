var express = require("express"),
    router = express.Router(),
    Flowertype = require("../models/flowertype");

//show all
router.get("/", function(req, res){
    Flowertype.find({}, function(err, allFlowertypes){
        if(err){
            console.log(err);
        }else{
             res.render("flowertypes/index", {flowertypes:allFlowertypes, currentUser: req.user});
        }
    });
 });
 
 //add new to DB
 router.post("/", isLoggedIn, function(req, res){
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var author={
         id: req.user._id,
         username: req.user.username
     };
     var newFlowertype = {name:name, image:image, description:desc, author:author};
    Flowertype.create(newFlowertype, function(err, newlyCreated){
     if(err){
         console.log(err);
     }else{
         res.redirect("/flowertypes");
     }
    });
 });
 
 //show form to create new
 router.get("/new", isLoggedIn, function(req, res){
     res.render("flowertypes/new");
 });
 
 //more info
 router.get("/:id", function(req,res){
     Flowertype.findById(req.params.id).populate("comments").exec(function(err, foundFlowertype){
         if(err){
             console.log(err);
         }else{
             res.render("flowertypes/show", {flowertype : foundFlowertype});
         }
     });
 });

//midleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

 module.exports = router;