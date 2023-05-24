let config = require("../config");
const catchAsync = require("../utils/catchAsync");
const DiscussionThreads = require("../Models/discThread");
const Users = require("../Models/user");

exports.postDiscussionThread = catchAsync(async (req, res, next) => {
  if (!req.body.userId || !req.body.title || !req.body.content) {
    res.status(404).json({ message: "Kindly Fill all the fields" });
  }
  const discussionThreadExists = await DiscussionThreads.findOne({
    Title: req.body.title,
  });
  if (discussionThreadExists) {
    return res
      .status(400)
      .json({ message: "DiscussionThread with similar title already exists" });
  }
  // Create a new discussionThread post document
  const discussionThreadPost = new DiscussionThreads({
    User: req.body.userId,
    Title: req.body.title,
    Content: req.body.content,
    Approved: 1,
  });

  // Save the discussionThread post to the database
  discussionThreadPost.save((err, savedPost) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error saving discussionThread post" });
    }

    res
      .status(201)
      .json({ message: "DiscussionThread post created", post: savedPost });
  });
});

//Route for users to send them all the discussionThreads that are approved
exports.viewDiscussionThreads = catchAsync(async (req, res, next) => {
  try {
    DiscussionThreads.find({ Approved: 1 }).exec(async function (
      error,
      results
    ) {
      if (error) {
        return res.status(500).json({ msg: "Unable to find user" });
      }
      // Respond with valid data
      res.status(200).json(results);
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error viewing Discussion Threads" });
  }
});

//Route for view discussionThread by title
exports.viewDiscussionThreadByTitle = catchAsync(async (req, res, next) => {
  try {
    DiscussionThreads.find({ Title: req.body.title }).exec(async function (
      error,
      results
    ) {
      if (error) {
        return res.status(500).json({ msg: "Unable to find user" });
      }
      // Respond with valid data
      res.status(200).json(results);
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error viewing Discussion Threads" });
  }
});

//Route for delete discussionThread
exports.deleteDiscussionThread = catchAsync(async (req, res, next) => {
  try {
    const thread = await DiscussionThreads.findOne({ Title: req.body.title });
    if (!thread) {
      return res.status(400).send("Thread not found");
    }
    DiscussionThreads.deleteOne(
      { Title: req.body.title },
      function (err, results) {
        if (err)
          return res
            .status(500)
            .json({ message: "Error deleting Discussion Thread" });
        res
          .status(200)
          .json({ message: "Discussion Thread deleted successfully" });
      }
    );
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error deleting Discussion Thread" });
  }
});

//Route to edit discussionThread
exports.editDiscussionThread = catchAsync(async (req, res, next) => {
  try {
    DiscussionThreads.findOneAndUpdate(
      { _id: req.body.discussionThreadId },
      {
        Title: req.body.title,
        Content: req.body.content,
      },
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error while editing discussionThread" });
        }
        res
          .status(200)
          .json({ message: "DiscussionThread successfully updated" });
      }
    );
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error while editing discussionThread" });
  }
});

//Admin can approve the discussionThreads written by the user and nutritionists
exports.approveDiscussionThread = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res
        .status(404)
        .json({ message: "Kindly fill all required fields" });
    }
    DiscussionThreads.findOneAndUpdate(
      { Title: req.body.title },
      {
        Approved: 1,
      },
      function (err, result) {
        if (err) {
          return res.status(400).json(err);
        }
        res.status(200).json({ message: "DiscussionThread approved" });
      }
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

//Admin can provide remarks on discussionThread while rejecting any discussionThread written by user
exports.rejectDiscussionThread = catchAsync(async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body.title) {
      return res
        .status(404)
        .json({ message: "Kindly fill all required fields" });
    }
    DiscussionThreads.findOneAndUpdate(
      { Title: req.body.title },
      {
        Remarks: req.body.remarks,
        Approved: 0,
      },
      function (err, result) {
        if (err) {
          return res.status(400).json(err);
        }
        res
          .status(200)
          .json({ message: "Discussion Thread Rejected and Remarks added" });
      }
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// User can view all their discussionThreads that are not accepted by admin
exports.userViewUnapproved = catchAsync(async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(404).json({ message: "Kindly fill all required fields" });
  }
  try {
    DiscussionThreads.find({ User: req.body.userId })
      .find({ Approved: 0 })
      .exec(async function (error, results) {
        if (error) {
          return res.status(500).json({ msg: "Unable to find user" });
        }
        // Respond with valid data
        res.status(200).json(results);
      });
  } catch (error) {
    return res.status(400).json({ message: "Error viewing discussionThreads" });
  }
});
// User can view all their discussionThreads that are not accepted by admin
exports.userViewApproved = catchAsync(async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(404).json({ message: "Kindly fill all required fields" });
  }
  try {
    DiscussionThreads.find({ User: req.body.userId })
      .find({ Approved: 1 })
      .exec(async function (error, results) {
        if (error) {
          return res.status(500).json({ msg: "Unable to find user" });
        }
        // Respond with valid data
        res.status(200).json(results);
      });
  } catch (error) {
    return res.status(400).json({ message: "Error viewing discussionThreads" });
  }
});
// Admin can view all discussionThreads that are not approved
exports.viewAllUnapproved = catchAsync(async (req, res, next) => {
  try {
    DiscussionThreads.find({ Approved: 0 }).exec(async function (
      error,
      results
    ) {
      if (error) {
        return res
          .status(500)
          .json({ msg: "Unable to find discussionThreads" });
      }
      // Respond with valid data
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(400).json({ message: "Error viewing discussionThreads" });
  }
});

//Route for add comments on DiscussionThreads
exports.addComments = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.email || !req.body.comment) {
      return res.status(500).json({ msg: "Kindly fill all the fields" });
    }
    const date = new Date();
    const user = await Users.findOne({ email: req.body.email });
    DiscussionThreads.findOneAndUpdate(
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

// Route for editing a comment on a discussionThread post
exports.editComment = catchAsync(async (req, res, next) => {
  try {
    const commentId = req.body.commentId;
    const newComment = req.body.newComment;
    const title = req.body.title;

    if (!newComment) {
      return res.status(400).json({ message: "New comment cannot be empty" });
    }

    const discussionThread = await DiscussionThreads.findOne({ Title: title });
    if (!discussionThread) {
      return res
        .status(404)
        .json({ message: "Discussion Thread post not found" });
    }

    const comment = discussionThread.Comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.comment = newComment;
    await discussionThread.save();
    return res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Route for deleting a comment on a discussionThread post
exports.deleteComment = catchAsync(async (req, res, next) => {
  try {
    const commentId = req.body.commentId;
    const title = req.body.title;

    const discussionThread = await DiscussionThreads.findOne({ Title: title });
    if (!discussionThread) {
      return res
        .status(404)
        .json({ message: "DiscussionThread post not found" });
    }

    const comment = discussionThread.Comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.remove();
    await discussionThread.save();
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
    const user = await Users.findOne({ email: req.body.email });

    // Find the discussionThread post with the comment and add the reply
    const discussionThreadPost = await DiscussionThreads.findOne({
      Title: title,
    });
    if (!discussionThreadPost) {
      return res.status(404).json({ message: "DiscussionThread not found" });
    }

    const date = new Date();
    const comment = discussionThreadPost.Comments.find(
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

    // Save the updated discussionThread post
    const savedPost = await discussionThreadPost.save();

    res
      .status(200)
      .json({ message: "Reply added successfully", post: savedPost });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

exports.getComments = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res.status(404).send("Kindly provide the title");
    } else {
      const thread = await DiscussionThreads.findOne({ Title: req.body.title });
      if (!thread) {
        return res.status(404).send("Thread not found");
      }
      return res.status(200).json(thread.Comments);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const result = await DiscussionThreads.findOneAndUpdate(
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
    const discussionThreadPost = await DiscussionThreads.findOne({
      Title: title,
    });

    if (!discussionThreadPost) {
      return res
        .status(404)
        .json({ message: "DiscussionThread post not found" });
    }

    // Find the comment with the given ID
    const comment = discussionThreadPost.Comments.find(
      (c) => c._id == commentId
    );
    console.log("here", comment.replies);

    // Find the reply with the given ID and remove it from the comment
    comment.replies = comment.replies.filter((r) => r._id != replyId);

    // Save the changes to the discussionThread post
    await discussionThreadPost.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Route to like the discussionThread
exports.likeDiscussionThread = catchAsync(async (req, res, next) => {
  try {
    const title = req.body.title;
    const email = req.body.email;

    // Check if the discussionThread post exists in the database
    const discussionThreadPost = await DiscussionThreads.findOne({
      Title: title,
    });
    if (!discussionThreadPost) {
      return res
        .status(404)
        .json({ message: "DiscussionThread post not found" });
    }

    // Check if the user has already liked the discussionThread post
    const existingLike = discussionThreadPost.LikesCount.find(
      (like) => like.email === email
    );

    if (existingLike) {
      // If the user has already liked the post, remove their like
      discussionThreadPost.LikesCount = discussionThreadPost.LikesCount.filter(
        (like) => like.email !== email
      );
    } else {
      // Otherwise, add a new like
      discussionThreadPost.LikesCount.push({
        email: email,
        like: 1,
      });
    }

    // Save the updated discussionThread post to the database
    const updatedDiscussionThreadPost = await discussionThreadPost.save();

    res.status(200).json({
      message: "DiscussionThread post likes saved successfully",
      likesCount: updatedDiscussionThreadPost.LikesCount.length,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
