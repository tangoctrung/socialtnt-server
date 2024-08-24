const router = require("express").Router();
const MessageGroup = require("../models/MessageGroup");


// // TẠO MỘT TIN NHẮN

// router.post("/", async (req, res) => {
//     const newMessage = new Message(req.body);
  
//     try {
//       const savedMessage = await newMessage.save();
//       res.status(200).json(savedMessage);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
  

// // LẤY TOÀN BỘ TIN NHẮN CỦA MỘT CUỘC TRÒ CHUYỆN
  
// router.get("/:conversationId", async (req, res) => {
//     try {
//         const messages = await Message.find({
//         conversationId: req.params.conversationId,
//         });
//         res.status(200).json(messages);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


module.exports = router;
