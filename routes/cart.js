// routes/cart.js
const express = require('express');
const router = express.Router();
const { Cart, CartItem, Content } = require('../models');

// GET all carts
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.findAll({
      include: [{ model: CartItem, as: 'cartItems', include: ['content'] }],
    });
    res.json(carts);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE cart
router.post('/', async (req, res) => {
  try {
    const { cartName, cartType } = req.body;
    const newCart = await Cart.create({ cartName, cartType });
    res.json(newCart);
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET one cart
router.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id, {
      include: [{ model: CartItem, as: 'cartItems', include: ['content'] }],
    });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE cart
router.put('/:id', async (req, res) => {
  try {
    const { cartName, cartType } = req.body;
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    await cart.update({ cartName, cartType });
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE cart
router.delete('/:id', async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    await cart.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting cart:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ADD content to a cart
router.post('/:cartId/items', async (req, res) => {
  try {
    const { cartId } = req.params;
    const { contentId, rotationWeight } = req.body;

    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    const newItem = await CartItem.create({
      cartId: cart.id,
      contentId: content.id,
      rotationWeight: rotationWeight || 1.0,
    });
    res.json(newItem);
  } catch (err) {
    console.error('Error adding cart item:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// REMOVE content from cart
router.delete('/:cartId/items/:itemId', async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const item = await CartItem.findByPk(itemId);
    if (!item || item.cartId !== parseInt(cartId, 10)) {
      return res.status(404).json({ error: 'CartItem not found for this cart.' });
    }
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
