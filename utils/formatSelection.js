const { MusicContent } = require('../models');

/**
 * @typedef {Object} FormatPreference
 * @property {string} formatId - Format identifier
 * @property {number} percentage - Desired percentage (0-100)
 */

/**
 * @typedef {Object} FormatUsage
 * @property {string} formatId - Format identifier
 * @property {number} duration - Total duration used
 * @property {number} count - Number of songs used
 */

class FormatSelector {
  /**
   * @param {Object.<string, number>} preferences - Format ID to percentage mapping
   * @example
   * const selector = new FormatSelector({
   *   'CLASSIC_ROCK': 50,
   *   'COUNTRY': 25,
   *   'JAZZ': 25
   * });
   */
  constructor(preferences) {
    this.validateFormatPreferences(preferences);
    this.preferences = this.normalizePercentages(preferences);
    this.usage = Object.keys(preferences).reduce((acc, format) => {
      acc[format] = { duration: 0, count: 0 };
      return acc;
    }, {});
    this.totalDuration = 0;
  }

  /**
   * Get next format that needs content based on current distribution
   * @returns {string|null} Format ID that needs content next
   */
  getNextRequiredFormat() {
    const currentPercentages = this.calculateCurrentPercentages();
    return Object.entries(this.preferences)
      .reduce((lowest, [format, target]) => {
        const current = currentPercentages[format] || 0;
        const deficit = target - current;
        return deficit > lowest.deficit ? { format, deficit } : lowest;
      }, { format: null, deficit: -Infinity }).format;
  }

  /**
   * Calculate current percentage distribution of formats
   * @returns {Object.<string, number>} Format percentages
   */
  calculateCurrentPercentages() {
    if (this.totalDuration === 0) {
      return Object.keys(this.preferences).reduce((acc, format) => {
        acc[format] = 0;
        return acc;
      }, {});
    }

    return Object.entries(this.usage).reduce((acc, [format, data]) => {
      acc[format] = (data.duration / this.totalDuration) * 100;
      return acc;
    }, {});
  }

  /**
   * Track usage of a format
   * @param {string} formatId - Format identifier
   * @param {number} duration - Duration in seconds
   */
  trackFormatUsage(formatId, duration) {
    if (!this.usage[formatId]) {
      throw new Error(`Invalid format ID: ${formatId}`);
    }
    this.usage[formatId].duration += duration;
    this.usage[formatId].count++;
    this.totalDuration += duration;
  }

  /**
   * Calculate score for a song within its format
   * @param {Object} song - Music content object
   * @param {boolean} useTagScoring - Whether to include tag-based scoring
   * @returns {number} Score from 0-100
   */
  async getFormatScore(song, useTagScoring = false) {
    let score = 0;
    const format = song.format;
    const currentPercentage = this.calculateCurrentPercentages()[format] || 0;
    const targetPercentage = this.preferences[format] || 0;

    // Base score from format needs
    score += Math.max(0, (targetPercentage - currentPercentage)) * 0.5;

    // Reference tag scoring if enabled
    if (useTagScoring) {
      score += await this.calculateTagScore(song);
    }

    return Math.min(100, score);
  }

  /**
   * Validate and normalize format preferences
   * @private
   * @param {Object.<string, number>} preferences 
   */
  validateFormatPreferences(preferences) {
    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Format preferences must be an object');
    }

    const total = Object.values(preferences).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.1) {
      throw new Error('Format percentages must total 100%');
    }
  }

  /**
   * Calculate tag-based score for a song
   * @private
   * @param {Object} song - Music content object
   * @returns {Promise<number>} Score contribution from tags
   */
  async calculateTagScore(song) {
    // Reference existing tag scoring system
    ```javascript:generatePlaylist_advancedTag.js
    startLine: 27
    endLine: 38
    ```
  }
}

module.exports = FormatSelector; 