const express = require('express');
const router = express.Router();
const { StationContent, Station, ClockTemplate } = require('../models');
const { validateStationContent } = require('../middleware/validation');
const { checkPermissions, isAdmin } = require('../middleware/auth');

/**
 * Get list of station content with enhanced filtering
 * @route GET /api/station-content
 */
router.get('/', async (req, res) => {
  try {
    const {
      stationId,
      cartType,
      contentType,
      active,
      page = 1,
      limit = 50
    } = req.query;

    const where = {};
    if (stationId) where.stationId = stationId;
    if (cartType) where.cartType = cartType;
    if (contentType) where.contentType = contentType;
    if (active === 'true') {
      where.startDate = { [Op.lte]: new Date() };
      where.endDate = { [Op.gte]: new Date() };
    }

    const content = await StationContent.findAndCountAll({
      where,
      include: [
        { model: Station },
        {
          model: ClockTemplate,
          attributes: ['name', 'hour'],
          through: { attributes: ['position'] }
        }
      ],
      limit,
      offset: (page - 1) * limit
    });

    res.json({
      data: content.rows,
      total: content.count,
      page,
      totalPages: Math.ceil(content.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create force cart content (admin only)
 * @route POST /api/station-content/force-cart
 */
router.post('/force-cart', [isAdmin, validateStationContent], async (req, res) => {
  try {
    const content = await StationContent.createForceCart({
      ...req.body,
      cartType: 'FRC1',
      createdBy: req.user.id
    });
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update system cart configuration
 * @route PUT /api/station-content/:id/system-cart
 */
router.put('/:id/system-cart', checkPermissions('station.content.edit'), async (req, res) => {
  try {
    const content = await StationContent.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Station content not found' });
    }

    // Validate system cart type
    const { cartType, scheduling } = req.body;
    if (!['SID1', 'TIM1', 'WEA1'].includes(cartType)) {
      return res.status(400).json({ error: 'Invalid system cart type' });
    }

    await content.updateSystemCartConfig(cartType, scheduling);
    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ... other existing routes ...

module.exports = router; 