import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: "all fields are required" })
        return;
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        res.status(409).send("user with that email already exists");
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