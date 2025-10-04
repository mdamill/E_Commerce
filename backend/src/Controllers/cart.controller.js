import { Cart } from "../Models/cart.model.js";

// add to cart
export const addToCart = async (req, res) => {

    try {
        const { productId, title, price, qty, imgSrc } = req.body;

        const userId = `68e0248983f696f89b9fadd2`;

        // Find or create cart in one line
        let cart = await Cart.findOne({ userId });

        if (!cart) cart = new Cart({ userId, items: [] });

        // Check if item exists
        const isItemExists = cart.items.find(
            (item) => (
                item.productId.equals(productId)
            )
        );

        if (isItemExists) {
            isItemExists.qty += qty;
            isItemExists.price += price * qty;
        }
        else cart.items.push({ productId, title, price, qty, imgSrc });

        await cart.save();

        res.json({
            message: 'Item added to Cart successfully !',
            success: true
        });
    } catch (error) {
        res.json({
            message: error.message,
            success: false
        });
    }
}

