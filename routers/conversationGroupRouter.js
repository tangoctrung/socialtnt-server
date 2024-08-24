const router = require("express").Router();
const ConversationGroup = require("../models/ConversationGroup");

// TẠO MỘT CUỘC TRÒ CHUYỆN

router.post("/", async (req, res) => {
    const newConversation = new ConversationGroup({
        nameGroup: req.body.nameGroup,
        membersGroup: [...req.body.membersGroup],
    });
    
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
});



// LẤY CUỘC TRÒ CHUYỆN NHÓM CỦA 1 USER
  
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await ConversationGroup.find({
        membersGroup: { $in: [req.params.userId] },
    }).populate('membersGroup', ['username', 'avatar']);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // LẤY CUỘC TRÒ CHUYỆN CO ID

// router.get("/chat/:conversationGroupId", async (req, res) => {
//   try {
//     const conversation = await ConversationGroup.findById(req.params.conversationId);
//     res.status(200).json(conversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
  

// // CẬP NHẬT TIN NHẮN CUỐI CỦA CUỘC TRÒ TRUYỆN

// router.put('/:id', async (req, res) => {
//   try{
//     const c = await ConversationGroup.findByIdAndUpdate(req.params.id, {
//       $set: req.body
//     }, {new: true});
//     res.status(200).json(c);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


module.exports = router;
