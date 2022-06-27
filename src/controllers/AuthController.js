const User = require( '../models/User');
const jwt = require( 'jsonwebtoken');
const bcrypt = require( 'bcryptjs');
const Project = require ('../models/Project')
const Task = require ('../models/Task')
require("dotenv").config();

module.exports = {
    async signup(req, res) {
        try{
            const { username, email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({message: "All input is required"});
            }
            
            const userDb = await User.findOne({email})
            if(userDb) {
                return res.status(409).json({message: "User Already Exist. Please Login"});
            }
            
            encryptedPassword = await bcrypt.hash(password, 10);
            
            const user = await User.create({
                username,
                email,
                password: encryptedPassword,
                projects: []
            });
            
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
            console.log(token)   
            return res.status(201).json(user);
        }catch(err) {
            console.log(err)
        }
    },

    async signin (req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({email})

            if (!email || !password) {
                return res.status(400).json({ message:"All input is required"});
            }
            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                  { user_id: user._id, email },
                  process.env.TOKEN_KEY,
                  {
                    expiresIn: "2h",
                  }
                );
                return res.status(200).json({...user._doc, token});
              }
            return res.status(400).json({message: "Invalid Credentials"});
        }catch(err){
            return res.status(500).json({ message: err });
        }
    },

    async getUser(req, res) {
        const { user_id } = req.user;

        const user = await User.findOne({ _id: user_id });

        await user.populate({
            path : 'projects',
            populate : {
              path : 'tasks'
            }
        })
        return res.status(200).json(user);
    }
};
