const express = require("express");
const app = express();
const user = require("./Routes/user");
const post = require("./Routes/post");

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/user",user);
app.use("/post",post);

app.listen(3000,()=>{
    console.log("listening to the port 3000");
})