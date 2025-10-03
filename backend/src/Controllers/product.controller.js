import { Product } from '../Models/product.model.js'

// add product
export const addProduct = async (req, res) => {

    const { title, description, price, category, qty, imgSrc } = req.body;
    try {

        const product = await Product.create({ title, description, price, category, qty, imgSrc });

        res.json({
            message: `Products Added Successfully !`,
            product,
            success: true
        });

    } catch (error) {
        res.json({
            message: `Error in Adding the Products !`,
            success: false
        })
    }
}

// get all products
export const getProducts = async(req, res) => {
    try {

        const allProducts = await Product.find({}).sort({createdAt:-1});
        res.json({
            message : `All Products !!`,
            allProducts,
            success : true
        })
        
    } catch (error) {
        res.json({
            message : `Error in getting the Products !`,
            success : false
        })
    }
}

