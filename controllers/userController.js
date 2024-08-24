const router = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');

// CREATE A USER / REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
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

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const newUser = await User.findOne({email: req.body.email});
        !newUser && res.status(400).json("No exits");

        const validate = await bcrypt.compare(req.body.password, newUser.password);
        !validate && res.status(400).json("No exits");

        const {password, ...other} = newUser._doc;
        res.status(200).json(other);

    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;