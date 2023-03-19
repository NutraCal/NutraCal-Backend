const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
    type: Number,
    required: true,
    default: 0,
  },
  Comments: {
    type: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
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
            userId: {
              type: mongoose.Types.ObjectId,
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
    default: 0,
  },
});

module.exports = mongoose.model("Blogs", blogsSchema);
