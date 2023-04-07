const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const discussionThreadSchema = new Schema({
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
    type: [
      {
        email: {
          type: String,
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
            email: {
              type: String,
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
      },
    ],
  },
  DateCreated: {
    type: Date,
    default: Date.now,
  },
  Approved: {
    type: Number,
  },
  Remarks: {
    type: String,
  },
});

module.exports = mongoose.model("DiscussionThread", discussionThreadSchema);
