let express = require("express");
let app = express();
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var flowertypes =[
    {name:"Rose", image:"https://images.unsplash.com/photo-1531874824027-2a0d33bd6338?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"},
    {name:"Cymbidium Orchid", image:"https://images.unsplash.com/photo-1542407242725-7d7f3d865665?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
    {name:"Peony", image:"https://images.unsplash.com/photo-1527061011665-3652c757a4d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/flowertypes", function(req, res){
    res.render("flowertypes", {flowertypes:flowertypes});
});

app.post("/flowertypes", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newFlowertype = {name:name, image:image};
    flowertypes.push(newFlowertype);
    res.redirect("/flowertypes");
});

app.get("/flowertypes/new", function(req, res){
    res.render("new");
});

app.listen(port, function(){
    console.log("START");
});