const express = require('express');
const router = express.Router();
const { AdvertisingContent, Campaign, Vertical, ClockTemplate } = require('../models');
const { validateAdvertisingContent } = require('../middleware/validation');
const { checkPermissions } = require('../middleware/auth');

/**
 * Get list of advertising content with campaign/vertical filtering
 * @route GET /api/advertising-content
 */
router.get('/', async (req, res) => {
  try {
    const {
      campaignId,
      cartType,
      vertical,
      active,
      page = 1,
      limit = 50
    } = req.query;

    const where = {};
    if (campaignId) where.campaignId = campaignId;
    if (cartType) where.cartType = cartType;
    if (vertical) where.verticalRestrictions = { [Op.contains]: [vertical] };
    if (active === 'true') {
      where.startDate = { [Op.lte]: new Date() };
      where.endDate = { [Op.gte]: new Date() };
    }

    const ads = await AdvertisingContent.findAndCountAll({
      where,
      include: [
        { model: Campaign },
        { model: Vertical },
        {
          model: PlaybackLog,
          attributes: ['playedAt'],
          required: false,
          limit: 1,
          order: [['playedAt', 'DESC']]
        }
      ],
      limit,
      offset: (page - 1) * limit
    });

    res.json({
      data: ads.rows,
      total: ads.count,
      page,
      totalPages: Math.ceil(ads.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Check cart scheduling eligibility
 * @route GET /api/advertising-content/:id/check-eligibility
 */
router.get('/:id/check-eligibility', async (req, res) => {
  try {
    const { stationId, templateId, position } = req.query;
    const ad = await AdvertisingContent.findByPk(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    // Check both play eligibility and clock template compatibility
    const [eligibility, compatibility] = await Promise.all([
      ad.checkPlayEligibility(stationId),
      ad.checkClockTemplateCompatibility(templateId, position)
    ]);

    res.json({
      canPlay: eligibility.canPlay && compatibility.isCompatible,
      playEligibility: eligibility,
      templateCompatibility: compatibility
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update cart type and scheduling
 * @route PUT /api/advertising-content/:id/cart-config
 */
router.put('/:id/cart-config', checkPermissions('advertising.edit'), async (req, res) => {
  try {
    const ad = await AdvertisingContent.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    const { cartType, scheduling } = req.body;
    await ad.updateCartConfiguration(cartType, scheduling);
    res.json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ... other existing routes ...

module.exports = router; 