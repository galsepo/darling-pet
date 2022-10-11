const Pet = require("../models/pet");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const pets = await Pet.find({});
    res.render("pets/index", { pets });
}

module.exports.renderNewForm = (req, res) => {
    res.render("pets/new");
}

module.exports.createPet = async (req, res, next) => {
    const pet = new Pet(req.body.pet);
    pet.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    pet.author = req.user._id;
    await pet.save();
    req.flash("success", "Successfully made a new pet!");
    res.redirect(`/pets/${pet._id}`);
}

module.exports.showCampcround = async (req, res, next) => {
    const pet = await Pet.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("author");
    if (!pet) {
        req.flash("error", "Cannot find that pet");
        return res.redirect("/pets")
    }
    res.render("pets/show", { pet });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
        req.flash("error", "Cannot find that pet");
        return res.redirect("/pets")
    }
    res.render("pets/edit", { pet });
}

module.exports.updatePet = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const pet = await Pet.findByIdAndUpdate(id, { ...req.body.pet });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    pet.images.push(...imgs);
    await pet.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await pet.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "Successfully update pet!");
    res.redirect(`/pets/${id}`);
}
module.exports.deletePet = async (req, res, next) => {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted pet!");
    res.redirect("/pets");
}