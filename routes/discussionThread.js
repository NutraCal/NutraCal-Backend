var express = require("express");
var router = express.Router();
const discussionThreadController = require("../Controller/discussionThreadController");

router.get("/viewThreads", discussionThreadController.viewDiscussionThreads);
router.get("/viewAllUnapproved", discussionThreadController.viewAllUnapproved);
router.post("/viewUnapproved", discussionThreadController.userViewUnapproved);
router.post("/viewApproved", discussionThreadController.userViewApproved);
router.post(
  "/viewThreadByTitle",
  discussionThreadController.viewDiscussionThreadByTitle
);
router.put("/addComments", discussionThreadController.addComments);
router.put(
  "/approveThread",
  discussionThreadController.approveDiscussionThread
);
router.post("/postThread", discussionThreadController.postDiscussionThread);
router.put("/rejectThread", discussionThreadController.rejectDiscussionThread);
router.put("/replyOnComment", discussionThreadController.addCommentReply);
router.put("/editThread", discussionThreadController.editDiscussionThread);
router.put("/editComment", discussionThreadController.editComment);
router.put("/editReply", discussionThreadController.editReply);
router.put("/deleteReply", discussionThreadController.deleteReply);
router.put("/deleteComment", discussionThreadController.deleteComment);
router.delete(
  "/deleteThread",
  discussionThreadController.deleteDiscussionThread
);
router.put("/likeThread", discussionThreadController.likeDiscussionThread);
router.post("/getComments", discussionThreadController.getComments);

module.exports = router;
