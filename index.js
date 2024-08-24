const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const authRouter = require("./routers/authRouter");
const commentRouter = require("./routers/commentRouter");
const replyCommentRouter = require("./routers/replyCommentRouter");
const messageRouter = require("./routers/messageRouter");
const conversationRouter = require("./routers/conversationRouter");
const messageGroupRouter = require("./routers/messageGroupRouter");
const conversationGroupRouter = require("./routers/conversationGroupRouter");
const notificationRouter = require("./routers/notificationRouter");
const fileConversationRouter = require("./routers/fileConversationRouter");
const socketServer = require("./socketServer");
const cors = require('cors');
const multer = require("multer");
const { ExpressPeerServer } = require('peer');

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

// https://socialtnt.netlify.app
// http://localhost:3000

// Socket
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://socialtnt.netlify.app",
  },
});

io.on("connection", (socket) => {
    socketServer(socket);
});

// Create Peer Sever
const peerServer = ExpressPeerServer(httpServer, {
  path: '/'
});

app.use('/peerjs', peerServer);

// connect to the database, mongodb://localhost:27017/SocialTNT
mongoose
  .connect(`${process.env.DB_URL}}`, {
    dbName: "socialtnt",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(console.log("Connect to MongDB"))
  .catch((err) => console.error(err));

console.log("process.env.DB_URL: ", process.env.DB_URL);
console.log("process.env.ACCESS_TOKEN_SECRET: ", process.env.ACCESS_TOKEN_SECRET);



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});



const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/replycomment", replyCommentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messagesgroup", messageGroupRouter);
app.use("/api/conversationsgroup", conversationGroupRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/fileconversation", fileConversationRouter);

const PORT = process.env.PORT || 8800;
httpServer.listen(PORT, () => {
  console.log("server is running on port 8800");
});
