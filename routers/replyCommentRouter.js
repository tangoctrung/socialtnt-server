const router = require("express").Router();
const ReplyComment = require("../models/ReplyComments");

// CREATE REPLYCOMMENT

router.post("/", async (req, res) => {
    const {userId, commentId, content} = req.body;
    const newReplyComment = new ReplyComment({userId, commentId, content});
    try {
        const savedReplyComment = await newReplyComment.save();
        res.status(200).json(savedReplyComment);
    } catch (err) {
        res.status(500).json(err);
    }
});


// GET ALL REPLYCOMMENT OF COMMENT

router.get("/comment/:id", async (req, res) => {
    const commentId = req.params.id;
    try {
        const replyComments = await ReplyComment.find({commentId: commentId}).populate('userId', [
            'username', 'avatar'
        ]);
        res.status(200).json(replyComments);
    } catch (err) {
        res.status(500).json(err);
    }
})

// LIKE/UNLIKE REPLYCOMMENT
router.put("/likereplyComment", async (req, res) => {
    try {
      const replyComment = await ReplyComment.findById(req.body.replyCommentId);
      if (!replyComment.likes.includes(req.body.userId)) {
        await replyComment.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The comment has been like");
      } else {
        await replyComment.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The comment has been unlike");
      }
    } catch (err) {
      res.status(500).json(err);
    }
});

// UPDATE REPLYCOMMENT
router.put("/:id", async (req, res) => {
  try {
    const comment = await ReplyComment.findByIdAndUpdate({_id: req.params.id}, { $set: req.body }, {new: true})
    .populate('userId', ['username', 'avatar']);  
      res.status(200).json(comment);  
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE REPLYCOMMENT
router.put("/:id/delete", async (req, res) => {
  try {
    const comment = await ReplyComment.findByIdAndUpdate({_id: req.params.id}, { $set: req.body }, {new: true});
    res.status(200).json(comment);  
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
