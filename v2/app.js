let express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser")
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/flower_types", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var flowertypeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Flowertype = mongoose.model("Flowertype", flowertypeSchema);

/*Flowertype.create(
    {
        name:"Rose",
        image:"https://images.unsplash.com/photo-1531874824027-2a0d33bd6338?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        description:"All roses were originally wild and they come from several parts of the world, North America, Europe, northwest Africa and many parts of Asia and Oceania. There are over 100 different species of roses."
    }, function(err, flowertype){
       if(err){
           console.log(err);
       } else{
           console.log("NEW FLOWER");
           console.log(flowertype);
       }
});*/

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
    Flowertype.findById(req.params.id, function(err, foundFlowertype){
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