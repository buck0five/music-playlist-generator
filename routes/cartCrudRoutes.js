// routes/cartCrudRoutes.js

const express = require('express');
const router = express.Router();

const { Cart, CartItem, Content, Station } = require('../models');

// -----------------------------------------------------------------------------
// GET /api/carts?stationId=X
//   Lists all carts, optionally filtered by stationId
router.get('/', async (req, res) => {
  try {
    const stationId = req.query.stationId;
    const whereClause = {};
    if (stationId) {
      whereClause.stationId = stationId;
    }

    // If your repo had an `include: [Station]` or other logic, keep it:
    const carts = await Cart.findAll({
      where: whereClause,
      include: [Station], // only if you want station info
    });

    res.json(carts);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Server error fetching carts.' });
  }
});

// -----------------------------------------------------------------------------
// POST /api/carts
//   Creates a new cart, referencing stationId if provided
router.post('/', async (req, res) => {
  try {
    // Merged fields from your repo
    const { name, category, stationId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Cart name is required.' });
    }

    const newCart = await Cart.create({
      name,
      category: category || null,
      stationId: stationId || null, // if provided, tie the cart to that station
      rotationIndex: 0, // or if your code has a default?
    });
    res.json(newCart);
  } catch (err) {
    console.error('Error creating cart:', err);
    res
      .status(500)
      .json({ error: 'Server error creating cart.' });
  }
});

// -----------------------------------------------------------------------------
// GET /api/carts/:id
//   Fetch one cart + items referencing Content
router.get('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    // Optionally include station:
    const cart = await Cart.findByPk(cartId, { include: [Station] });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    // fetch cartItems referencing Content
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

// -----------------------------------------------------------------------------
// PUT /api/carts/:id
//   Update cart name, category, station, rotationIndex, etc.
router.put('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { name, category, stationId, rotationIndex } = req.body;

    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    if (name !== undefined) cart.name = name;
    if (category !== undefined) cart.category = category;
    if (stationId !== undefined) cart.stationId = stationId;
    if (rotationIndex !== undefined) cart.rotationIndex = rotationIndex;
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Server error updating cart.' });
  }
});

// -----------------------------------------------------------------------------
// DELETE /api/carts/:id
router.delete('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }
    await cart.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting cart:', err);
    res.status(500).json({ error: 'Server error deleting cart.' });
  }
});

// -----------------------------------------------------------------------------
// POST /api/carts/:id/add-content
//   Attach content to a cart with optional scheduling fields
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
      return res
        .status(400)
        .json({ error: 'contentId is required.' });
    }
    const newItem = await CartItem.create({
      cartId,
      contentId,
      startDate: startDate || null,
      endDate: endDate || null,
      daysOfWeek: daysOfWeek || null,
      startHour: startHour !== '' ? startHour : null,
      endHour: endHour !== '' ? endHour : null,
    });
    res.json({ success: true, cartItem: newItem });
  } catch (err) {
    console.error('Error adding content to cart:', err);
    res
      .status(500)
      .json({ error: 'Server error adding content.' });
  }
});

// -----------------------------------------------------------------------------
// PUT /api/carts/:id/update-item/:cartItemId
//   Update scheduling fields for a pivot
router.put('/:id/update-item/:cartItemId', async (req, res) => {
  try {
    const { id: cartId, cartItemId } = req.params;
    const { startDate, endDate, daysOfWeek, startHour, endHour } = req.body;

    const pivot = await CartItem.findOne({ where: { id: cartItemId, cartId } });
    if (!pivot) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    pivot.startDate = startDate || null;
    pivot.endDate = endDate || null;
    pivot.daysOfWeek = daysOfWeek || null;
    pivot.startHour = startHour !== '' ? startHour : null;
    pivot.endHour = endHour !== '' ? endHour : null;
    await pivot.save();
    res.json({ success: true, cartItem: pivot });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res
      .status(500)
      .json({ error: 'Server error updating cart item.' });
  }
});

// -----------------------------------------------------------------------------
// DELETE /api/carts/:id/remove-content/:contentId
//   Remove pivot
router.delete('/:id/remove-content/:contentId', async (req, res) => {
  try {
    const { id: cartId, contentId } = req.params;
    const pivot = await CartItem.findOne({ where: { cartId, contentId } });
    if (!pivot) {
      return res
        .status(404)
        .json({ error: 'Content not in cart (pivot not found).' });
    }
    await pivot.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing content from cart:', err);
    res
      .status(500)
      .json({ error: 'Server error removing content.' });
  }
});

module.exports = router;
