var express = require("express");
var router = express.Router();
const Blogs = require("../Models/blogs");
const Users = require("../Models/user");
const blogController = require("../Controller/blogController");

router.get("/viewBlogs", blogController.viewRecipes);
router.get("/viewBlogByTitle", blogController.viewBlogByTitle);
router.put("/editBlog", blogController.editBlog);
router.put("/addComments", blogController.addComments);
router.put("/approveBlog", blogController.approveBlog);
router.delete("/deleteBlog", blogController.deleteBlog);

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
