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