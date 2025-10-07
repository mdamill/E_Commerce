import { Address } from "../Models/address.model.js";


// add user address
export const addAddress = async (req, res) => {

    const { fullName, address, city, state, country, pincode, phoneNumber } = req.body;

    const userId = req.user;
    console.log(req.user);

    try {
        const userAddress = await Address.create({
            userId,
            fullName,
            address,
            city,
            state,
            country,
            pincode,
            phoneNumber
        });

        res.json({
            message: `Address added successfully !`,
            userAddress,
            success: true
        })
    } catch (error) {
        res.json({
            message: `Problem in adding the address !!!`,
            success: false
        })
    }
}

// get address
export const getAddress = async (req, res) => {

    const userId = req.user;
    // console.log("USER-ID : ", userId);

    try {
        const address = await Address.find({ userId }).sort({ createdAt: -1 });

        res.json({
            message: `Most recent address fetched successfully !`,
            userAddress: address[0],
            success: true
        })
    } catch (error) {
        res.json({
            message: `Can't fetch address : ${error.message}`,
            success: false
        })
    }
} 