let express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Flowertype = require("./models/flowertype"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/new_flower_types", {useNewUrlParser: true});
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
            res.render("index", {flowertypes:allFlowertypes});
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
    res.render("new");
});

app.get("/flowertypes/:id", function(req,res){
    Flowertype.findById(req.params.id).populate("comments").exec(function(err, foundFlowertype){
        if(err){
            console.log(err);
        }else{
            res.render("show", {flowertype : foundFlowertype});
        }
    });
});

app.listen(port, function(){
    console.log("START");
});