import jwt from 'jsonwebtoken'
import { User } from '../Models/user.model.js'

export const isAuthenticated = async (req, res, next) => {

    const token = req.header("Authorization");

    if (!token) return res.json({ message: "Login first !" });

    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET)

    // console.log(decodedInfo);

    const id = decodedInfo.userId;

    const user = await User.findById(id)

    if (!user) return res.json({ message: "User not exist" });

    req.user = user;

    next();

}