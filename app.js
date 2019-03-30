var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



//schema setup 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

//compile schema into a model
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Mountain Goat's Rest", 
//     image: "https://farm2.staticflickr.com/1287/4670981254_5654b5dd25.jpg",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
    
// },function(err, campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("NEWLY CREATED CAMPGROUND:");
//         console.log(campground);
//     }
// })


    
app.get("/", function(req, res){
    res.render("landing");
}); 



//INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
            
        }else{
            res.render("index", {campgrounds: allCampgrounds});
        }
        
    });
    
});



//CREATE ROUTE - add a new campground to DB
app.post("/campgrounds", function(req, res){ 
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampgrounds = {name: name, image: image, description: desc};
   //create a new campground and save to the database
   Campground.create(newCampgrounds, function(err, newCreated){
       if(err){
           console.log(err);
       }else{
              //redirect back to campgrounds page
              res.redirect("/campgrounds");
       }
   });
   

});



//NEW ROUTE - show form  to create new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs");
});



//SHOW ROUTE - show more info about one campground
app.get("/campgrounds/:id", function(req, res){
    
    //find campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            
        }else{
             //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
   
});
    


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Sever has started")
}); 