const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const discussionForumSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dFormTitle: {
    type: String,
    required: true,
  },
  dfContent: {
    type: String,
    required: true,
  },
  likesCount: {
    type: Number,
    required: true,
    default: 0,
  },
  comments: {
    type: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
          default: Date.now,
        },
        replies: [
          {
            userId: {
              type: mongoose.Types.ObjectId,
              required: true,
            },
            comment: {
              type: String,
              required: true,
            },
            date: {
              type: String,
              required: true,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("discussionForumSchema", blogsSchema);
