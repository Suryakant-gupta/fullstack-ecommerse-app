import validator from "validator";
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'


const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}


// User login route
const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success:false , message: "User doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true, token})
        }else{
            return res.json({success:false , message: "Invalid credentials"});
        }
    } catch (error) {
        console.log(error);
        return res.json({success:false , message: error.message});

        
    }
}


// User Sign up route
const registerUser = async(req, res)=>{
    try {
        const {name, email, password} = req.body;

        // checking user already existes
        const exists = await userModel.findOne({email});

        if (exists) {
            return res.json({success : false, message: "User already exists"});
        }

        // validating email format and strong pass
        if (!validator.isEmail(email)) {
            return res.json({success : false, message: "please enter a valid email"});
        }
        if (password.length < 8) {
            return res.json({success : false, message: "please enter a strong password"});
        }


        // hashing user password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email, 
            password : hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({success: true , token})



    } catch (error) {
        console.log(error);
        res.json({success:false , message:error.message})
    }
}

// Admin login route
const adminLogin = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})
        }else{
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});   
    }
}

export {loginUser, registerUser, adminLogin}