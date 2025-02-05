// routes/cartCrudRoutes.js
const express = require('express');
const router = express.Router();
const { Cart, CartItem, Content } = require('../models');

// GET /api/carts -> list all carts
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Server error fetching carts.' });
  }
});

// POST /api/carts -> create a new cart
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Cart "name" is required.' });
    }
    const newCart = await Cart.create({ name });
    res.json(newCart);
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(500).json({ error: 'Server error creating cart.' });
  }
});

// GET /api/carts/:id -> fetch one cart, plus its items referencing Content
router.get('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    // fetch pivot entries
    const cartItems = await CartItem.findAll({
      where: { cartId },
      // must match "as: 'Content'"
      include: [{ model: Content, as: 'Content' }],
    });

    res.json({ cart, items: cartItems });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Server error fetching cart.' });
  }
});

// PUT /api/carts/:id -> update cart name
router.put('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { name } = req.body;
    const cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    if (name !== undefined) {
      cart.name = name;
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Server error updating cart.' });
  }
});

// DELETE /api/carts/:id -> remove the cart entirely
router.delete('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    await cart.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting cart:', err);
    res.status(500).json({ error: 'Server error deleting cart.' });
  }
});

// POST /api/carts/:id/add-content -> attach content item to this cart
router.post('/:id/add-content', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { contentId } = req.body;
    if (!contentId) {
      return res
        .status(400)
        .json({ error: 'contentId is required to add content to the cart.' });
    }

    const cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const content = await Content.findByPk(contentId);
    if (!content) return res.status(404).json({ error: 'Content not found.' });

    const cartItem = await CartItem.create({ cartId, contentId });
    res.json({ success: true, cartItem });
  } catch (err) {
    console.error('Error adding content to cart:', err);
    res.status(500).json({ error: 'Server error adding content.' });
  }
});

// DELETE /api/carts/:id/remove-content/:contentId
// -> remove that content from the cart pivot
router.delete('/:id/remove-content/:contentId', async (req, res) => {
  try {
    const { id: cartId, contentId } = req.params;
    const pivot = await CartItem.findOne({ where: { cartId, contentId } });
    if (!pivot) {
      return res
        .status(404)
        .json({ error: 'Content is not in this cart (pivot not found).' });
    }
    await pivot.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing content from cart:', err);
    res.status(500).json({ error: 'Server error removing content.' });
  }
});

module.exports = router;
