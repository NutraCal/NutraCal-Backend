const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const commentSchema = new Schema({
  user: {
    type: User.schema, // Embed the user schema directly
  },
  comment: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
  replies: [
    {
      user: {
        type: User.schema, // Embed the user schema directly
      },
      comment: {
        type: String,
      },
      date: {
        type: String,
        default: Date.now,
      },
    },
  ],
});

const blogsSchema = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Content: {
    type: String,
    required: true,
  },
  LikesCount: {
    type: [
      {
        email: {
          type: String,
        },
        like: {
          type: Number,
        },
      },
    ],
  },
  Comments: {
    type: [commentSchema],
  },
  DateCreated: {
    type: Date,
    default: Date.now,
  },
  Approved: {
    type: Number,
  },
  Image: {
    filename: {
      type: String,
    },
    contentType: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  Remarks: {
    type: String,
  },
});

module.exports = mongoose.model("Blogs", blogsSchema);
