// routes/cartCrudRoutes.js

const express = require('express');
const router = express.Router();
const { Cart, CartItem, Content, Station } = require('../models');

// GET /api/carts -> list all carts (optional stationId=)
router.get('/', async (req, res) => {
  try {
    const stationId = req.query.stationId;
    const whereClause = {};
    if (stationId) {
      whereClause.stationId = stationId;
    }

    const carts = await Cart.findAll({
      where: whereClause,
      // Eager-load Station (no 'as') if the association is plain
      include: [Station],
    });
    res.json(carts);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Server error fetching carts.' });
  }
});

// POST /api/carts -> create a new cart
router.post('/', async (req, res) => {
  try {
    const { name, category, stationId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Cart name is required.' });
    }
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }
    const newCart = await Cart.create({
      name,
      category,
      stationId,
    });
    res.json(newCart);
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(500).json({ error: 'Server error creating cart.' });
  }
});

// GET /api/carts/:id -> fetch one cart + items
router.get('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId, {
      include: [Station], // same logic
    });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [{ model: Content, as: 'Content' }],
    });
    res.json({ cart, items: cartItems });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Server error fetching cart.' });
  }
});

// PUT /api/carts/:id -> update cart
router.put('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { name, category, stationId } = req.body;
    const cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    if (name !== undefined) cart.name = name;
    if (category !== undefined) cart.category = category;
    if (stationId !== undefined) cart.stationId = stationId;

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Server error updating cart.' });
  }
});

// DELETE /api/carts/:id
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

// POST /api/carts/:id/add-content
router.post('/:id/add-content', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { contentId } = req.body;
    if (!contentId) {
      return res.status(400).json({ error: 'contentId required.' });
    }

    const cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const content = await Content.findByPk(contentId);
    if (!content) return res.status(404).json({ error: 'Content not found.' });

    const cartItem = await CartItem.create({ cartId, contentId });
    res.json({ success: true, cartItem });
  } catch (err) {
    console.error('Error adding content:', err);
    res.status(500).json({ error: 'Server error adding content.' });
  }
});

// DELETE /api/carts/:id/remove-content/:contentId
router.delete('/:id/remove-content/:contentId', async (req, res) => {
  try {
    const { id: cartId, contentId } = req.params;
    const pivot = await CartItem.findOne({ where: { cartId, contentId } });
    if (!pivot) {
      return res.status(404).json({ error: 'Content not found in cart.' });
    }
    await pivot.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing content:', err);
    res.status(500).json({ error: 'Server error removing content.' });
  }
});

module.exports = router;
