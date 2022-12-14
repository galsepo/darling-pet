const Review = require("../models/review");
const Pet = require("../models/pet");

module.exports.createReview = async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    pet.reviews.push(review);
    await review.save();
    await pet.save();
    req.flash("success", "Successfully made a new review!");
    res.redirect(`/pets/${pet.id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Pet.findByIdAndUpdate(id, { $pull: { revies: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/pets/${id}`);
}