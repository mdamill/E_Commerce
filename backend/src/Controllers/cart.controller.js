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

// get user's cart
export const userCart = async (req, res) => {

    const userId = `68e0248983f696f89b9fadd2`;

    let cart = await Cart.findOne({ userId })

    if (!cart)
        return res.json({
            message: error.message,
            success: false
        })

    res.json({
        message: 'Cart successfully fetched !',
        success: true,
        cart
    });
}

// remove product from the cart
export const removeProductFromCart = async (req, res) => {
    const productId = req.params.productId;
    const userId = `68e0248983f696f89b9fadd2`;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ messge: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId)

    await cart.save();

    res.json({ message: "product remove from cart" });
};

// clear cart items
export const clearCart = async (req, res) => {
    const userId = `68e0248983f696f89b9fadd2`;

    try {
        let cart = await Cart.findOne({ userId })

        if (!cart) {
            cart = new Cart({ userId, items: [] })
        } else {
            cart.items = []
        }

        await cart.save()

        res.json({
            message: `Cart removed successfully !`,
            success: true
        })
    } catch (error) {
        res.json({
            message: `Can't remove cart : ${error.message}`,
            success: false
        })
    }
}


