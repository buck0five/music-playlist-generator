const validateLibraryContent = async (req, res, next) => {
  const { contentType, contentId } = req.body;
  
  if (!contentType || !contentId) {
    return res.status(400).json({ 
      error: 'Content type and ID are required' 
    });
  }

  if (!['MUSIC', 'ADVERTISING', 'STATION'].includes(contentType)) {
    return res.status(400).json({ 
      error: 'Invalid content type' 
    });
  }

  next();
};

module.exports = {
  validateLibraryContent
}; 