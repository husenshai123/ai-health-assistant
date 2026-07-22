// Controller for health tips
const getHealthTips = (req, res) => {
  // Array of simple health tips
  const tips = [
    "Drink at least 8 glasses of water daily.",
    "Get 7-8 hours of sleep every night.",
    "Eat fresh fruits and vegetables daily."
  ];
  
  // Return tips as JSON response
  res.status(200).json({ success: true, tips });
};

module.exports = { getHealthTips };