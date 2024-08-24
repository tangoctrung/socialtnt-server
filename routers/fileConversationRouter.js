const router = require("express").Router();
const FileConversation = require("../models/FileConversations");

// TẠO MỘT FILE CỦA CUỘC TRÒ CHUYỆN

router.post("/", async (req, res) => {
    const { typeFile, urlFile, conversationId, senderId } = req.body; 
    const newFile = new FileConversation({typeFile, urlFile, conversationId, senderId});
    try{
        const newFileConversation = await newFile.save();
        res.status(200).json(newFileConversation);
    } catch (error) {
        res.status(500).json(error);
    }
});


// UPDATE MỘT FILE CỦA CUỘC TRÒ CHUYỆN

router.put("/deletefile", async (req, res) => {
    const { urlImage } = req.body;
    try{
        const newFile = await FileConversation.findOneAndUpdate(
            {urlFile: urlImage}, {isDelete: false}, {new: true}
        );
        res.status(200).json(newFile);
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router;
