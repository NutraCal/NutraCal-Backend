const User = require("../Models/user");
const Recipe = require("../Models/recipes");
let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const Blogs = require("../Models/blogs");
const Users = require("../Models/user");
const multer = require("multer");

exports.postBlog = catchAsync(async (req, res, next) => {
  if (!req.body.userId || !req.body.title || !req.body.content || !req.file) {
    res.status(404).json({ message: "Kindly Fill all the fields" });
  }
  const blogExists = await Blogs.findOne({ Title: req.body.title });
  if (blogExists) {
    return res
      .status(400)
      .json({ message: "Blog with similar title already exists" });
  }
  // Create a new blog post document
  const blogPost = new Blogs({
    User: req.body.userId,
    Title: req.body.title,
    Content: req.body.content,
    Approved: 0,
  });

  // If an image was uploaded, store its metadata in the blog post document
  if (req.file) {
    console.log("Uploading image");
    blogPost.Image = {
      filename: req.file.filename,
      contentType: req.file.mimetype,
      url: `https://example.com/${req.file.filename}`,
    };
  }

  // Save the blog post to the database
  blogPost.save((err, savedPost) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving blog post" });
    }

    res.status(201).json({ message: "Blog post created", post: savedPost });
  });
});

exports.viewBlogs = catchAsync(async (req, res, next) => {
  try {
    Blogs.find({ Approved: 1 }).exec(async function (error, results) {
      if (error) {
        return res.status(500).json({ msg: "Unable to find user" });
      }
      // Respond with valid data
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(400).json({ message: "Error viewing blogs" });
  }
});

exports.viewBlogByTitle = catchAsync(async (req, res, next) => {
  try {
    Blogs.find({ Title: req.body.title }).exec(async function (error, results) {
      if (error) {
        return res.status(500).json({ msg: "Unable to find user" });
      }
      // Respond with valid data
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(400).json({ message: "Error viewing blogs" });
  }
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  try {
    Blogs.deleteOne({ Title: req.body.title }, function (err, results) {
      if (err) return res.status(500).json({ message: "Error deleting blog" });
      res.status(200).json({ message: "Blog deleted successfully" });
    });
  } catch (err) {
    return res.status(400).json({ message: "Error deleting blog" });
  }
});

exports.editBlog = catchAsync(async (req, res, next) => {
  try {
    Blogs.findOneAndUpdate(
      { _id: req.body.blogId },
      {
        Title: req.body.title,
        Content: req.body.content,
      },
      function (err, result) {
        if (err) {
          return res.status(500).json({ message: "Error while editing blog" });
        }
        res.status(200).json({ message: "Blog successfully updated" });
      }
    );
  } catch (err) {
    return res.status(400).json({ message: "Error while editing blog" });
  }
});

exports.approveBlog = catchAsync(async (req, res, next) => {
  Blogs.findOneAndUpdate(
    { Title: req.body.title },
    {
      Approved: 1,
    },
    function (err, result) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json({ message: "Blog approved" });
    }
  );
});
exports.addComments = catchAsync(async (req, res, next) => {
  if (!req.body.title || !req.body.uid || !req.body.comment) {
    return res.status(500).json({ msg: "Kindly fill all the fields" });
  }
  Blogs.findOneAndUpdate(
    { Title: req.body.title },
    {
      $push: {
        Comments: {
          userId: req.body.uid,
          comment: req.body.comment,
          date: Date.now,
        },
      },
    },
    function (err, result) {
      if (err) {
        res.status(400).json({ message: "Can't add the comment, try again" });
      }
      res.status(200).json({ message: "Comment received" });
    }
  );
});
