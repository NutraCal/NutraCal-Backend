var express = require("express");
var router = express.Router();
const multer = require("multer");
const Blogs = require("../Models/blogs");
const Users = require("../Models/user");
const blogController = require("../Controller/blogController");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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
router.post("/viewBlogByTitle", blogController.viewBlogByTitle);
router.put("/editBlog", blogController.editBlog);
router.put("/addComments", blogController.addComments);
router.put("/approveBlog", blogController.approveBlog);
router.delete("/deleteBlog", blogController.deleteBlog);
router.post("/postBlog", upload.single("photo"), blogController.postBlog);

// /* POST user routes. */
// router.post("/addBlog", function(req,res,next){
//   Blogs.create(req.body)
//     .then(
//       (blog) => {
//         console.log("Blog added ", blog);
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.json(blog);
//       },
//       (err) => next(err)
//     )
//     .catch((err) => next(err));
// })

module.exports = router;
