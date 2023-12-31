var express = require("express");
var router = express.Router();
const blogController = require("../Controller/blogController");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
router.get("/viewBlogs", blogController.viewBlogs);
router.get("/viewAllUnapproved", blogController.viewAllUnapproved);
router.post("/viewUnapproved", blogController.userViewUnapproved);
router.post("/viewApproved", blogController.userViewApproved);
router.post("/viewBlogByTitle", blogController.viewBlogByTitle);
router.put("/addComments", blogController.addComments);
router.put("/approveBlog", blogController.approveBlog);
//multer image storing for blogs
router.post("/postBlog", upload.single("photo"), blogController.postBlog);
router.put("/rejectBlog", blogController.rejectBlog);
router.put("/replyOnComment", blogController.addCommentReply);
router.put("/editBlog", blogController.editBlog);
router.put("/editComment", blogController.editComment);
router.put("/editReply", blogController.editReply);
router.put("/deleteReply", blogController.deleteReply);
router.put("/deleteComment", blogController.deleteComment);
router.delete("/deleteBlog", blogController.deleteBlog);
router.put("/likeBlog", blogController.likeBlog);
router.post("/getComments", blogController.getComments);

module.exports = router;
