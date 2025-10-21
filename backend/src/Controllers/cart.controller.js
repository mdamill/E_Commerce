import { Cart } from "../Models/cart.model.js";

// add to cart
export const addToCart = async (req, res) => {
    const { productId, title, price, qty, imgSrc } = req.body;

    const userId = req.user;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
        cart.items[itemIndex].price += price * qty;
    } else {
        cart.items.push({ productId, title, price, qty, imgSrc });
    }

    await cart.save();
    res.json({ message: "Items Added To Cart", cart });
};

// get user's cart
// get user's cart
export const userCart = async (req, res) => {
    try {
        const userId = req.user;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.json({
                message: "Cart not found",
                success: false,
            });
        }

        res.json({
            message: "Cart successfully fetched!",
            success: true,
            cart,
        });
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
        });
    }
};


// remove product from the cart
export const removeProductFromCart = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ messge: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId)

    await cart.save();

    res.json({ message: "product remove from cart" });
};

// clear cart items
export const clearCart = async (req, res) => {
    
    const userId = req.user;

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

// Decrease product quantity in cart
export const decreaseProductQty = async (req, res) => {
    const userId = req.user;
    try {
        const { productId, qty = 1 } = req.body; // default qty = 1

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return res.status(400).json({ message: 'Product not found in cart' });

        const pricePerUnit = item.price / item.qty;

        if (item.qty > qty) {
            item.qty -= qty;
            item.price -= pricePerUnit * qty;
        } else {
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        }

        await cart.save();
        res.json({ message: 'Cart updated successfully', cart });

    } catch (err) {
        console.error('Error decreasing product qty:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


