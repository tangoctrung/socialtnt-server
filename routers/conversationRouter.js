const router = require("express").Router();
const Conversation = require("../models/Conversations");

// TẠO MỘT CUỘC TRÒ CHUYỆN

router.post("/", async (req, res) => {
    const newConversation = new Conversation({
      members: [...req.body.members],
    });
  
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
});


// LẤY CUỘC TRÒ CHUYỆN CỦA 1 USER
  
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LẤY CUỘC TRÒ CHUYỆN CO ID

router.get("/chat/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
  
  
// LẤY CUỘC TRÒ CHUYỆN CỦA 2 NGƯỜI
  
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if (conversation) {
      res.status(200).json(conversation)
    } else {
      const newConversation = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId],
      });
      try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// CẬP NHẬT TIN NHẮN CUỐI CỦA CUỘC TRÒ TRUYỆN

router.put('/:id', async (req, res) => {
  try{
    const c = await Conversation.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true});
    res.status(200).json(c);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
