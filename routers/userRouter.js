const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Posts");
const verifyToken = require("../middleware/auth");

// TÌM KIẾM NGƯỜI DÙNG THEO USERNAME OR EMAIL
router.get('/', verifyToken, async (req, res) => {
  const username = req.query.username;
  let userArray = [];
  try {
      const users = await User.find();
      users.map(user => {
           if (user.username.toLowerCase().includes(username.toLowerCase())) {
               userArray.push(user);
           }
      })
      res.status(200).json(userArray);
  } catch (err) {
      res.status(500).json(err);
  }
  
})


// GET A USER
router.get("/profile/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USER
router.get("/alluser", verifyToken, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE INFO A USER
router.put("/profile/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET FOLLOWERS

router.get("/profile/followers/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.follower.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, avatar } = friend;
      friendList.push({ _id, username, avatar });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET FOLLOWINGS

router.get("/profile/followings/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, avatar } = friend;
      friendList.push({ _id, username, avatar });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LẤY TẤT CẢ USER MÀ NGƯỜI DÙNG CHƯA FOLLOW
router.get("/nofollowings/:userId/", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const allUsers = await User.find();
    const friends = [];
    allUsers.forEach((u) => {
        if(!user.following.includes(u._id)) {
          friends.push({_id: u._id, username: u.username, avatar: u.avatar});
        } 
      })

    // let friendList = [];
    // friends.map((friend) => {
    //   const { _id, username, avatar } = friend;
    //   friendList.push({ _id, username, avatar });
    // });
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json(err);
  }
});

//FOLLOW A USER

router.put("/profile/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.follower.includes(req.body.userId)) {
        await user.updateOne({ $push: { follower: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

// UNFOLLOWING A USER

router.put("/profile/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.follower.includes(req.body.userId)) {
        await user.updateOne({ $pull: { follower: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

// ADD SEARCH HISTORY FOR USER

router.put("/addSearchHistory", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);   
        const history = await currentUser.updateOne({ $push: { searchHistorys: req.body.history } });
        res.status(200).json(history);   
    } catch (err) {
      res.status(500).json(err);
    }
});

// DELETE SEARCH HISTORY FOR USER

router.put("/deleteSearchHistory", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);   
      const history = await currentUser.updateOne({ $pull: { searchHistorys: req.body.history } });
      res.status(200).json(history);   
  } catch (err) {
    res.status(500).json(err);
  }
});

// SAVE / UNSAVE POST

router.put("/savepost/", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user.postSaved.includes(req.body.postId)) {
      await user.updateOne({ $push: { postSaved: req.body.postId } });
      res.status(200).json("The post has been saved");
    } else {
      await user.updateOne({ $pull: { postSaved: req.body.postId } });
      res.status(200).json("The post has been unsaved");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL POST SAVED

router.get("/savepost/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const posts = await Promise.all(
      user.postSaved.map((postId) => {
        return Post.findById(postId).populate('authorId', ['username', 'avatar']);
      })
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
