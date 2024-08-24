const router = require("express").Router();
const Message = require("../models/Messages");


// TẠO MỘT TIN NHẮN

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
});

// XÓA MỘT TIN NHẮN

router.put("/delete", async (req, res) => {

  try {
    const savedMessage = await Message.findByIdAndUpdate({_id: req.body.messageId}, {isDelete: true}, {new: true});
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LẤY TOÀN BỘ TIN NHẮN CỦA MỘT CUỘC TRÒ CHUYỆN
  
router.get("/:conversationId", async (req, res) => {
  try {
      const messages = await Message.find({
      conversationId: req.params.conversationId,
      }).populate('senderId', ["username"]);
      res.status(200).json(messages);
  } catch (err) {
      res.status(500).json(err);
  }
});

// LẤY TOÀN BỘ URL CỦA MESSAGE CỦA 1 CUỘC TRÒ CHUYỆN

// router.get("/:conversationId/urlmessage", async (req, res) => {

//   try {
//     let listUrl = [];
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });

//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
// }
// });

module.exports = router;
