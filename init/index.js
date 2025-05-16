const mongoose = require("mongoose");
const newdata = require("./data.js");
const listing = require("../modals/listing.js");

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

const initdb = async () => {
   try{ await listing.deleteMany({});
    listing.insertMany(newdata.data);
    console.log(newdata.data);
    console.log("data was initialised")
}catch(e){
    console.log(e);
}
}

initdb();
