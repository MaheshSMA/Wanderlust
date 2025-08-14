const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("get for posts");
});

router.get("/:id",(req,res)=>{
    res.send("get for post id");
})

router.post("/",(req,res)=>{
    res.send("post for posts");
})

router.delete("/:id",(req,res)=>{
    res.send("delete for post id");
})

module.exports = router;