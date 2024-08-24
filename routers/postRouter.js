const router = require("express").Router();
const Post = require("../models/Posts");
const User = require("../models/Users");
const verifyToken = require("../middleware/auth");

// TẠO MỘT BÀI VIẾT

router.post("/", async (req, res) => {

    const {authorId, title, body, images, hashtags, themen} = req.body;
    const newPost = new Post({authorId, title, body, images, hashtags, themen});
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE POST

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate({_id: req.params.id}, { $set: req.body }, {new: true})
      .populate('authorId', [
        'username', 'avatar'
      ]);  
    res.status(200).json(post);  
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE POST

router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);  
    res.status(200).json("the post has been deleted");  
  } catch (err) {
    res.status(500).json(err);
  }
});

// LẤY MỘT BÀI VIẾT CÓ ID

router.get("/post/:id", verifyToken, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('authorId', [
        'username', 'avatar'
      ]);
      // .populate('likes', ['username']).populate('dislikes', ['username']);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
});

// LẤY TẤT CẢ BÀI VIẾT CỦA MỘT NGƯỜI DÙNG
router.get("/profile/:id", verifyToken, async (req, res) => {
  // const id = req.params.id;
    try {
      const posts = await Post.find({ authorId: req.params.id }).populate('authorId', [
        'username', 'avatar'
      ]);
      // .populate('likes', ['username']).populate('dislikes', ['username']);
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
});

// LẤY TẤT CẢ BÀI VIẾT LIÊN QUAN ĐẾN NGƯỜI DÙNG HOẶC BẠN BÈ NGƯỜI DÙNG

router.get("/timeline/:userId" , async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ authorId: currentUser._id }).populate('authorId', [
      'username', 'avatar'
    ]);
    // .populate('likes', ['username']).populate('dislikes', ['username']);
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ authorId: friendId }).populate('authorId', [
          'username', 'avatar'
        ]);
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

// TÌM KIẾM BÀI VIẾT THEO HASHTAG
router.get('/', verifyToken, async (req, res) => {
  const hashtag = req.query.hashtag;
  try{
      const posts = await Post.find({ hashtags : { $all : [hashtag] }}).populate('authorId', [
        'username', 'avatar'
      ]);
      // .populate('likes', ['username']).populate('dislikes', ['username']);
      res.status(200).json(posts);
  }catch(err){
      res.status(500).json(err);
  }
})

// TÌM KIẾM BÀI VIẾT THEO CHỦ ĐỀ
router.get('/themen/', verifyToken, async (req, res) => {
  const themen = req.query.themen;
  try{
      const posts = await Post.find({ themen: themen }).populate('authorId', [
        'username', 'avatar'
      ]);
      // .populate('likes', ['username']).populate('dislikes', ['username']);
      res.status(200).json(posts);
  }catch(err){
      res.status(500).json(err);
  }
})

// LIKE POST

router.put("/post/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


// DISLIKE POST

router.put("/post/:id/dislike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.dislikes.includes(req.body.userId)) {
      await post.updateOne({ $push: { dislikes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { dislikes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
