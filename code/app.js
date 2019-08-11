let express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Flowertype = require("./models/flowertype"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/flower_types_4", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX list of all
app.get("/flowertypes", function(req, res){
   Flowertype.find({}, function(err, allFlowertypes){
       if(err){
           console.log(err);
       }else{
            res.render("flowertypes/index", {flowertypes:allFlowertypes});
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
app.get("/flowertypes/:id/comments/new", function(req, res) {
    Flowertype.findById(req.params.id, function(err, flowertype){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {flowertype: flowertype});
       }
    })
});

app.post("/flowertypes/:id/comments", function(req, res) {
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

app.listen(port, function(){
    console.log("START");
});