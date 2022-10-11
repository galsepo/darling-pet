const mongoose = require("mongoose");
const Pet = require("../models/pet");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");

mongoose
  .connect("mongodb://localhost:27017/darling-pet")
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log(err);
    console.log("OH, NO! MONGO CONNECTION ERROR!");
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Pet.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 20;
    const camp = new Pet({
      author: "6317b8d5f3c8c5cc31c215e9",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi tempora saepe amet, nesciunt molestiae hic totam facilis impedit, dignissimos, maxime quis! Fuga quas facere ullam iusto beatae eveniet odit consequatur?",
      images: [
        {
          url: 'https://res.cloudinary.com/da7pzkcgs/image/upload/v1662752681/DarlingPet/ecexq7ymw72htyhijyhm.jpg',
          filename: 'DarlingPet/ecexq7ymw72htyhijyhm'
        },
        {
          url: 'https://res.cloudinary.com/da7pzkcgs/image/upload/v1662752683/DarlingPet/ld0x1x2vtpx21ztcsqqh.jpg',
          filename: 'DarlingPet/ld0x1x2vtpx21ztcsqqh'
        }
      ],
    });

    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
