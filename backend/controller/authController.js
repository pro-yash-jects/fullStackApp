import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: "all fields are required" })
        return;
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        res.status(409).send("Already exists");
        console.log("already exists")
        return;
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userData = {
        firstName,
        lastName,
        email,
        password: hashedPwd,
        role: 'User'
    }
    try {
        const newUser = await User.create(userData);
        res.status(201).send("User created succesfully")
        return;
    }
    catch (err) {
        console.log("Error creating user", err)
        res.send("error creating user");
        return;
    }
}

export const login = async (req,res)=>{
    const {email, password} = req.body;
    if (!email || !password){
        res.status(400).send("All fields are necessary");
        return;
    }
    const user = await User.findOne({email})
    if (!user){
        res.status(404).send("User with that email doesn't exist");
        return;
    }

    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified){
        res.status(400).send("Invalid credentials.")
        return;
    }
    const token = jwt.sign(
        {id:user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
    const userData = {
        firstName : user.firstName,
        email: user.email,
        role : user.role
    }
    res.status(200).json({message : "Logged in successfully", token, userData})

}