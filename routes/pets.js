const express = require("express");
const router = express.Router();
const pets = require("../controllers/pets");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validatePet } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get("/new", isLoggedIn, pets.renderNewForm);

router.route("/")
  .get(catchAsync(pets.index))
  .post(isLoggedIn, upload.array('image'), validatePet, catchAsync(pets.createPet));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(pets.renderEditForm));

router.route("/:id")
  .get(catchAsync(pets.showCampcround))
  .put(isLoggedIn, upload.array('image'), isAuthor, validatePet, catchAsync(pets.updatePet))
  .delete(isLoggedIn, isAuthor, catchAsync(pets.deletePet));

module.exports = router;
