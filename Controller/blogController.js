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
      url: "http://localhost:8000/" + req.file.filename,
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

//Route for users to send them all the blogs that are approved
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

//Route for view blog by title
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

//Route for delete blog
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

//Route to edit blog
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

//Admin can approve the blogs written by the user and nutritionists
exports.approveBlog = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res
        .status(404)
        .json({ message: "Kindly fill all required fields" });
    }
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
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

//Admin can provide remarks on blog while rejecting any blog written by user
exports.rejectBlog = catchAsync(async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body.title) {
      return res
        .status(404)
        .json({ message: "Kindly fill all required fields" });
    }
    Blogs.findOneAndUpdate(
      { Title: req.body.title },
      {
        Remarks: req.body.remarks,
        Approved: 0,
      },
      function (err, result) {
        if (err) {
          return res.status(400).json(err);
        }
        res.status(200).json({ message: "Blog Rejected and Remarks added" });
      }
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// User can view all their blogs that are not accepted by admin
exports.userViewUnapproved = catchAsync(async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(404).json({ message: "Kindly fill all required fields" });
  }
  try {
    Blogs.find({ User: req.body.userId })
      .find({ Approved: 0 })
      .exec(async function (error, results) {
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

// User can view all their blogs that are not accepted by admin
exports.userViewApproved = catchAsync(async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(404).json({ message: "Kindly fill all required fields" });
  }
  try {
    Blogs.find({ User: req.body.userId })
      .find({ Approved: 1 })
      .exec(async function (error, results) {
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
// Admin can view all blogs that are not approved
exports.viewAllUnapproved = catchAsync(async (req, res, next) => {
  try {
    Blogs.find({ Approved: 0 }).exec(async function (error, results) {
      if (error) {
        return res.status(500).json({ msg: "Unable to find blogs" });
      }
      // Respond with valid data
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(400).json({ message: "Error viewing blogs" });
  }
});

//Route for add comments on Blogs
exports.addComments = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.email || !req.body.comment) {
      return res.status(500).json({ msg: "Kindly fill all the fields" });
    }
    const user = await User.findOne({ email: req.body.email });
    const date = new Date();
    Blogs.findOneAndUpdate(
      { Title: req.body.title },
      {
        $push: {
          Comments: {
            user: user,
            comment: req.body.comment,
            date: date,
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
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Route for editing a comment on a blog post
exports.editComment = catchAsync(async (req, res, next) => {
  try {
    const commentId = req.body.commentId;
    const newComment = req.body.newComment;
    const title = req.body.title;

    if (!newComment) {
      return res.status(400).json({ message: "New comment cannot be empty" });
    }

    const blog = await Blogs.findOne({ Title: title });
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comment = blog.Comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.comment = newComment;
    await blog.save();
    return res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Route for deleting a comment on a blog post
exports.deleteComment = catchAsync(async (req, res, next) => {
  try {
    const commentId = req.body.commentId;
    const title = req.body.title;

    const blog = await Blogs.findOne({ Title: title });
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comment = blog.Comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.remove();
    await blog.save();
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Route to add a reply to a comment
exports.addCommentReply = catchAsync(async (req, res, next) => {
  try {
    const { title, commentId, email, reply } = req.body;

    // Check if all required fields are provided
    if (!title || !commentId || !email || !reply) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const date = new Date();

    // Find the blog post with the comment and add the reply
    const blogPost = await Blogs.findOne({ Title: title });
    if (!blogPost) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const user = await User.findOne({ email: email });

    const comment = blogPost.Comments.find(
      (c) => c._id.toString() === commentId.toString()
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      user: user,
      comment: reply,
      date: date,
    });
    // Save the updated blog post
    const savedPost = await blogPost.save();

    res
      .status(200)
      .json({ message: "Reply added successfully", post: savedPost });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Route to edit a reply to a comment
exports.editReply = catchAsync(async (req, res, next) => {
  try {
    const { commentId, replyId, comment } = req.body;
    if (!comment) {
      return res
        .status(400)
        .json({ message: "Please provide a valid comment" });
    }

    const result = await Blogs.findOneAndUpdate(
      { "Comments._id": commentId, "Comments.replies._id": replyId },
      { $set: { "Comments.$[comment].replies.$[reply].comment": comment } },
      {
        arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }],
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({ message: "Reply not found" });
    }

    res
      .status(200)
      .json({ message: "Reply updated successfully", comment: result });
  } catch (error) {
    res.status(500).json({ message: "Can't update the reply" });
  }
});

// Route to delete a reply to a comment
exports.deleteReply = catchAsync(async (req, res, next) => {
  try {
    const { title, commentId, replyId } = req.body;

    // Find the comment that contains the reply to be deleted
    const blogPost = await Blogs.findOne({ Title: title });

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Find the comment with the given ID
    const comment = blogPost.Comments.find((c) => c._id == commentId);
    console.log("here", comment.replies);

    // Find the reply with the given ID and remove it from the comment
    comment.replies = comment.replies.filter((r) => r._id != replyId);

    // Save the changes to the blog post
    await blogPost.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
exports.getComments = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res.status(404).send("Kindly provide the title");
    } else {
      const blog = await Blogs.findOne({ Title: req.body.title });
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      console.log("here");
      return res.status(200).json(blog.Comments);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Route to like the blog
exports.likeBlog = catchAsync(async (req, res, next) => {
  try {
    const title = req.body.title;
    const email = req.body.email;

    // Check if the blog post exists in the database
    const blogPost = await Blogs.findOne({ Title: title });
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check if the user has already liked the blog post
    const existingLike = blogPost.LikesCount.find(
      (like) => like.email === email
    );

    if (existingLike) {
      // If the user has already liked the post, remove their like
      blogPost.LikesCount = blogPost.LikesCount.filter(
        (like) => like.email !== email
      );
    } else {
      // Otherwise, add a new like
      blogPost.LikesCount.push({
        email: email,
        like: 1,
      });
    }

    // Save the updated blog post to the database
    const updatedBlogPost = await blogPost.save();

    res.status(200).json({
      message: "Blog post likes saved successfully",
      likesCount: updatedBlogPost.LikesCount.length + 1,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
