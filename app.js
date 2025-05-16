const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require('./modals/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
// const Listing = require("./modals/listing.js");
const initdata = require("./init/data.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require('./modals/reviews.js');

main()
.then(()=>{
    console.log("connected to db");
})
.catch(err => {
    console.log (err);
});

async function main(){ 
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

app.get("/", (req,res)=>{
    res.send("response  bn sent")
})

app.set("view engine","ejs");
app.set("views", path.join( __dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const initdb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data)
}

// initdb();


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(error, 400);
    }else{
        next();
    }
}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(error, 400);
    }else{
        next();
    }
}

//index route

app.get("/listing", wrapAsync( async (req,res) => {
    const allList = await listing.find({});
    res.render("listings/index",{allList});
})) ;

//NEW ROUTE
app.get("/listing/new",(req,res) => {
    res.render("listings/new");
})

//show route
app.get("/listing/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const list = await listing.findById(id).populate("reviews");
    res.render("listings/show",{list});
} ));
 
//create route
 
app.post(
    "/listing", validateListing,
    wrapAsync(async(req,res,next) =>{
        
        const newListing = new listing(req.body.listing);
        await newListing.save();
        res.redirect("/listing");
    })
);
 
//edit route
app.get("/listing/:id/edit", wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id);
    res.render("listings/edit",{list})
}));
 
//update
app.put("/listing/:id",validateListing,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect(`/listing/${id}`);
}));

//delete route
app.delete("/listing/:id", wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let deleted = await listing.findByIdAndDelete(id,{...req.body.listing});
    console.log(deleted);
    res.redirect("/listing");
}));

//review route
app.post("/listing/:id/reviews",validateReview,wrapAsync( async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();

    res.redirect(`/listing/${Listing.id}`);
}) );

app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    console.log("delete");

    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{ $pull : { reviews  : reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError("page not found", 404));  
    // res.send("page not found");
    // let {message, statusCode}=err;
    // res.send(message).status(statusCode);
})

// app.use((err,req,res,next)=>{
//     res.send("error");
// });

app.use((err,req,res,next)=>{
    let {message = "something went wrong", statusCode = 500}=err;
    // res.send(message).status(statusCode); 
    res.render("error.ejs", {message, statusCode});
});

app.listen(8080, () => {
    console.log("listening to the port 8080");
});