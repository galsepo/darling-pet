const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const PetSchema = new Schema({
  typeAnimal: String,
  namePets: String,
  images: [ImageSchema],
  description: String,

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

PetSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Pet", PetSchema);
