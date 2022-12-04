var express = require("express");
var router = express.Router();
const Blogs = require("../Models/blogs");

/* GET users routes. */
router.get("/viewBlogs", function (req, res, next) {
  Recipes.find().populate("user").exec((error,result))=>{
    if(error){
      return next(error);
    }
    else{
      res.json(result);
    }
  }
});

router.get("/viewBlogs/:bid", function (req, res, next) {
  Recipes.findById(req.params.bid).populate("user").exec((error,result))=>{
    if(error){
      return next(error);
    }
    else{
      res.json(result);
    }
  }
});

/* POST user routes. */
router.post("/addBlog", function(req,res,next){
  Blogs.create(req.body)
    .then(
      (blog) => {
        console.log("Blog added ", blog);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
})


/*Delte user route. */
router.delete("/delete/:bid", function (req, res, next) {
  Blogs.deleteOne({ _id: req.params.bid }, function (err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

/* PUT user route. */
router.put("/update/:bid",(req,res,next)=>{
  User.findOneAndUpdate({_id:req.params.rid},{
    blogTitle:req.body.blogTitle,
    content:req.body.content
  },
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});

router.put("/update/likes/:bid",(req,res,next)=>{
  User.findOneAndUpdate({_id:req.params.bid},{likes:req.body.likes},
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});

router.put("/addComments/:bid/:uid",(req,res,next)=>{
  User.findOneAndUpdate({_id:req.params.bid},
    {
      $push: {
        comments: {
          uid:req.body.uid,
          comment:req.body.comment, 
          date: Date.now
        }
      },
    }
  function(err,result){
    if(err) {
      return next(err);
    }
    res.status(200).json(result);
  })
});
