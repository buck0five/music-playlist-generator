// routes/cartCrudRoutes.js

const express = require('express');
const router = express.Router();
const { Cart, CartItem, Content, Station } = require('../models');

// GET /api/carts -> list all carts (optionally by stationId)
router.get('/', async (req, res) => {
  try {
    const stationId = req.query.stationId;
    const whereClause = {};
    if (stationId) {
      whereClause.stationId = stationId;
    }

    const carts = await Cart.findAll({
      where: whereClause,
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
    const cart = await Cart.findByPk(cartId, { include: [Station] });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    // fetch pivot items with scheduling fields
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

// PUT /api/carts/:id -> update cart name/category/stationId
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

// POST /api/carts/:id/add-content -> attach content item with optional scheduling
router.post('/:id/add-content', async (req, res) => {
  try {
    const cartId = req.params.id;
    const {
      contentId,
      startDate,
      endDate,
      daysOfWeek,
      startHour,
      endHour,
    } = req.body;

    if (!contentId) {
      return res.status(400).json({ error: 'contentId is required.' });
    }

    const cart = await Cart.findByPk(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const content = await Content.findByPk(contentId);
    if (!content) return res.status(404).json({ error: 'Content not found.' });

    // create the pivot with scheduling fields
    const cartItem = await CartItem.create({
      cartId,
      contentId,
      startDate: startDate || null,
      endDate: endDate || null,
      daysOfWeek: daysOfWeek || null,
      startHour: startHour !== undefined ? startHour : null,
      endHour: endHour !== undefined ? endHour : null,
    });

    res.json({ success: true, cartItem });
  } catch (err) {
    console.error('Error adding content to cart:', err);
    res.status(500).json({ error: 'Server error adding content.' });
  }
});

// PUT /api/carts/:id/update-item/:cartItemId -> update scheduling fields for a pivot
router.put('/:id/update-item/:cartItemId', async (req, res) => {
  try {
    const { id: cartId, cartItemId } = req.params;
    const {
      startDate,
      endDate,
      daysOfWeek,
      startHour,
      endHour,
    } = req.body;

    const pivot = await CartItem.findOne({
      where: { id: cartItemId, cartId },
    });
    if (!pivot) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    pivot.startDate = startDate || null;
    pivot.endDate = endDate || null;
    pivot.daysOfWeek = daysOfWeek || null;
    pivot.startHour = startHour !== undefined ? startHour : null;
    pivot.endHour = endHour !== undefined ? endHour : null;

    await pivot.save();
    res.json({ success: true, cartItem: pivot });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ error: 'Server error updating cart item.' });
  }
});

// DELETE /api/carts/:id/remove-content/:contentId
router.delete('/:id/remove-content/:contentId', async (req, res) => {
  try {
    const { id: cartId, contentId } = req.params;
    const pivot = await CartItem.findOne({
      where: { cartId, contentId },
    });
    if (!pivot) {
      return res
        .status(404)
        .json({ error: 'Content not in cart (pivot not found).' });
    }
    await pivot.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing content from cart:', err);
    res.status(500).json({ error: 'Server error removing content.' });
  }
});

module.exports = router;
