var express = require("express"),
    router = express.Router({mergeParams: true}),
    Flowertype = require("../models/flowertype"),
    Comment = require("../models/comment");

//new comment
router.get("/new",isLoggedIn, function(req, res) {
    Flowertype.findById(req.params.id, function(err, flowertype){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {flowertype: flowertype});
       }
    })
});

//create comment 
router.post("/", isLoggedIn, function(req, res) {
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

//midleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;