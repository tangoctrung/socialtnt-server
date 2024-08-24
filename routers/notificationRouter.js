const router = require("express").Router();
const Notification = require("../models/Notifications");
const verifyToken = require("../middleware/auth");

// CREATE NOTIFICATION
router.post('/createNotification', async (req, res) => {
    const {senderNotiId, receiverNotiId, typeNoti, postNotiId, content} = req.body;
    const notification = new Notification({senderNotiId, receiverNotiId, typeNoti, postNotiId, content});

    try{   
        const newNotification = await notification.save();
        res.status(200).json(newNotification);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL NOTIFICATION A USER
router.get('/getNotification/:id', async (req, res) => {
    const userId = req.params.id;
    const listNoti = [];
    try{   
        const notification = await Notification.find({receiverNotiId: {$in: [userId]}}).populate(
            'receiverNotiId', ['username', 'avatar'],
        ).populate('senderNotiId', ['username', 'avatar'])
        .populate('postNotiId', ['body']);
        notification.map((noti) => {
            if (!noti.deleteNotiId.includes(userId)){
                listNoti.push(noti);
            }
        })
        res.status(200).json(listNoti);
    } catch (err) {
        res.status(500).json(err);
    }
});


// DELETE NOTIFICATION
router.put('/deleteNotification', async (req, res) => {
    const {userId, notiId} = req.body;
    try{   
        const notification = await Notification.findById(notiId);
        if (!notification.deleteNotiId.includes(userId)) {
            await notification.updateOne({ $push: { deleteNotiId: userId } });
            res.status(200).json("The notification has been deleted");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE NOTIFICATION
router.put('/updateNotification', async (req, res) => {
    const {userId, notiId} = req.body;
    try{   
        const notification = await Notification.findById(notiId);
        if (!notification.readNotiId.includes(userId)) {
            await notification.updateOne({ $push: { readNotiId: userId } });
            res.status(200).json("The notification has been read");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
