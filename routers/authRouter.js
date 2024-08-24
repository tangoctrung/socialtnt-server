const router = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

// CREATE A USER / REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const user1 = await User.findOne({email: req.body.email});
        if (user1) 
            return res.status(400).send({success: false, message: "Email đã được sử dụng"})
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

// VERIFY TOKEN
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user)
            return res.status(400).json('User not found')
        res.status(200).json(user);
	} catch (error) {
		res.status(500).json('Internal server error')
	}
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const newUser = await User.findOne({email: req.body.email});
        if (!newUser) return res.status(400).json('Sai email hoặc mật khẩu.');  
            
        const validate = await bcrypt.compare(req.body.password, newUser.password);
        if (!validate) return res.status(400).json('Sai email hoặc mật khẩu.');          

        // tạo token
        const token = jwt.sign({_id: newUser._id}, process.env.ACCESS_TOKEN_SECRET);
        // res.header('auth-token', token);
        res.status(200).json({newUser, token});

    } catch (error) {
        res.status(500).json(error);
    }
})

// LOGIN WITH ID
router.post("/loginwithid", async (req, res) => {
    try {
        const newUser = await User.findById({_id: req.body.userId});
        !newUser && res.status(400).json("Sai email hoặc mật khẩu.");  
        // tạo token
        const token = jwt.sign({_id: newUser._id}, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({newUser, token});

    } catch (error) {
        res.status(500).json(error);
    }
})

// CHANGE PASSWORD
router.put('/changepassword', async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const user = await User.findOneAndUpdate({email: req.body.email}, {
            password: hashedPass,
        }, {new: true});      
        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;