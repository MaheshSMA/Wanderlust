const mongoose = require("mongoose");
const newdata = require("./data.js");
const listing = require("../modals/listing.js");

main()
  .then(async () => {
    console.log("connected to db");
    await initdb();
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
  });

async function main() {
    require("dotenv").config();
    await mongoose.connect(process.env.MONGO_URI);
  //await mongoose.connect("mongodb+srv://maheshmalge004:olsWCDmdk1fVMCoC@cluster0.tjgugka.mongodb.net/test");
}

const initdb = async () => {
  try {
    await listing.deleteMany({});
    await listing.insertMany(newdata.data);
    console.log(newdata.data);
    console.log("data was initialised");
  } catch (e) {
    console.log(e);
  }
};

// initdb();
