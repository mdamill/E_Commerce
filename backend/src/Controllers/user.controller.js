import {User} from '../Models/user.model.js'
import bcrypt from 'bcryptjs'

// user registration
export const register = async(req, res) => {

    const { username , email, password} = req.body

    try {

        let user = await User.findOne({email});
        if(user)
            return res.send({message: "User Already Exists !", success : false});

        //hasing password
        const hashedPassword = await bcrypt.hash(password, 15);

        user = await User.create({
            username,
            email,
            password : hashedPassword
        })

        res.json({
            message : `User Registerd Successfully !`,
            user,
            success : true
        });

    } catch (error) {
        console.log(`Error while registering user`, error);
        
    }
};