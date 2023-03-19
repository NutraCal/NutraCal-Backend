const User = require("../Models/user");
const Recipe = require("../Models/recipes");
let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const Blogs = require("../Models/blogs");
const Users = require("../Models/user");

exports.viewBlogs = catchAsync(async (req, res, next) => {
  Blogs.find()
    .populate("User")
    .exec((error, results) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          status: "success",
          data: {
            results,
          },
        });
      }
    });
});

exports.viewBlogByTitle = catchAsync(async (req, res, next) => {
  Blogs.find({ Title: req.body.title }).exec(async function (error, results) {
    if (error) {
      return next(error);
    }
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        results,
      },
    });
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  Blogs.deleteOne({ Title: req.body.title }, function (err, results) {
    if (err) return next(err);
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        results,
      },
    });
  });
});

exports.editBlog = catchAsync(async (req, res, next) => {
  Blogs.findOneAndUpdate(
    { _id: req.body.blogId },
    {
      Title: req.body.title,
      Content: req.body.content,
      Likes: req.body.likes,
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

exports.approveBlog = catchAsync(async (req, res, next) => {
  const appStatus = 1;
  Blogs.findOneAndUpdate(
    { _id: req.body.recipeId },
    {
      Approved: appStatus,
    },
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.status(200).json(result);
    }
  );
});

exports.addComments = catchAsync(async(req,res,next)=>{
  Blogs.findOneAndUpdate({_id:req.params.blogId},
    {
      $push: {
        comments: {
          userId:req.body.uid,
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