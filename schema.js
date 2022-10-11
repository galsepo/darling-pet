const Joi = require("joi");

module.exports.petSchema = Joi.object({
  pet: Joi.object({
    typeAnimal: Joi.string().required(),
    namePets: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),

  }),
  deleteImages: Joi.array()
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required(),
  }).required(),
});
