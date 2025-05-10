const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const upload = multer({storage});

// index Route
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

router
     .route("/")
     .get(wrapAsync(listingController.index))
     .post(isLoggedIn,
        upload.single("listing[image]"),
         validateListing,
         wrapAsync(listingController.createListing)
     );
    // .post(upload.single("listing[image]"), (req, res)=>  {
    //   res.send(req.file);
    // });

// //New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

router.route("/:id")
       .get(wrapAsync(listingController.showListing))
       .put(
         isLoggedIn,
         isOwner,
         upload.single("listing[image]"),
         validateListing,
         wrapAsync(listingController.updateListing)
      )
       .delete(
         isLoggedIn, 
        isOwner, wrapAsync(listingController.destroyListing)
      );

router.get("/:id/edit",
    isLoggedIn,isOwner,
    wrapAsync(listingController.renderEditForm)
)

// //New Route
// router.get("/new", isLoggedIn, (req, res) => {
//     res.render("listings/new.ejs");
// });

//Show Route
// router.get("/:id", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: {
//         path: "author",
//     },
//     })
//     .populate("owner");
//     if(!listing) {
//         req.flash("error", "Listing you requested does not exist!");
//         res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", {listing});
// }));

// Create Route 
// router.post("/", isLoggedIn,  validateListing,
// wrapAsync (async (req, res,next) => {
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// }));

// Edit Route 
// router.get("/:id/edit",
//     isLoggedIn,
//     isOwner,
//      wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing) {
//         req.flash("error", "Listing you requested does not exist!");
//         res.redirect("/listings");
//     }
//     res.render("listings/edit.ejs", {listing});
// }));

// Update Route
// router.put("/:id", 
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(async(req, res)=> {
//     let {id} = req.params;  
//     // let listing = await Listing.findById(id);
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     req.flash("success", "Listing Updated")
//     res.redirect (`/listings/${id}`);
// }));

// Delete Route
// router.delete("/:id",isLoggedIn, isOwner,
//     wrapAsync(async (req, res) => {
//         let {id} = req.params;
//         let deletedListing = await Listing.findByIdAndDelete(id);
//         console.log(deletedListing);
//         req.flash("success", "Listing Deleted");
//         res.redirect("/listings");
//     })
// );

module.exports = router;
