import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";


// 🟢 Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (err) {
    console.log("GET CART ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🟢 Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "ProductId required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{
          productId,
          quantity: 1,
          price: product.productPrice
        }],
        totalPrice: product.productPrice
      });
    } else {
      const item = cart.items.find(item =>
        item.productId.equals(productId)
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice
        });
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (err) {
    console.log("ADD CART ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🟢 Update Quantity
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    if (!productId || !type) {
      return res.status(400).json({
        success: false,
        message: "ProductId and type required"
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(item =>
      item.productId.equals(productId)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    if (type === "increase") item.quantity += 1;
    if (type === "decrease") {
      if (item.quantity > 1) item.quantity -= 1;
      else {
        // remove item if quantity = 1 and user clicks decrease
        cart.items = cart.items.filter(i => !i.productId.equals(productId));
      }
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart
    });

  } catch (err) {
    console.log("UPDATE CART ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// 🟢 Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => !item.productId.equals(productId)
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart
    });

  } catch (err) {
    console.log("REMOVE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};