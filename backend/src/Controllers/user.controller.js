import { User } from '../Models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// user registration
export const register = async (req, res) => {

    const { username, email, password } = req.body

    try {

        let user = await User.findOne({ email });
        if (user)
            return res.send({ message: "User Already Exists !", success: false });

        //hasing password
        const hashedPassword = await bcrypt.hash(password, 4);

        user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.json({
            message: `User Registerd Successfully !`,
            user,
            success: true
        });

    } catch (error) {
        console.log(`Error while registering user`, error);

    }
};

// user login 
export const login = async (req, res) => {

    const { email, password } = req.body;

    // console.log(email, password);
    

    try {

        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "User Not Found !", success: false });
        
        // password validation
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.json({ message: "Invalid Password !", success: false });

        // generating jwt token
        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {
            expiresIn : "1d"
        })

        res.json({
            message: `${user.username} successfully Logged In !`,
            token,
            success: true
        })


    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })

    }

}

// get all users
export const users = async (req, res) => {

    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json({
            users,
            success: true
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        })
    }
};

