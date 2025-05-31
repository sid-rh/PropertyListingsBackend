const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const { clearCache } = require('../middleware/cache');



//get recommendations received by the user.
const getReceivedRecommendations=async(req,res)=>{
    try {
    const recommendations = await Recommendation.find({ to: req.user.id })
      .populate('property')
      .populate('from', 'name email')
      .sort('-createdAt');

    res.json({
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

//get recommendations sent by the user.
const getSentRecommendations=async(req,res)=>{
    try {
    const recommendations = await Recommendation.find({ from: req.user.id })
      .populate('property')
      .populate('to', 'name email')
      .sort('-createdAt');

    res.json({
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

const createRecommendation=async(req,res)=>{
    try {
    const { propertyId, recipientEmail, message } = req.body;

    // Find recipient by email
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({
        error: 'Recipient not found'
      });
    }

    // Prevent self recommendations
    if (recipient.id === req.user.id) {
      return res.status(400).json({
        error: 'Cannot recommend properties to yourself'
      });
    }

    // Check if already recommended
    const existingRecommendation = await Recommendation.findOne({
      property: propertyId,
      from: req.user.id,
      to: recipient.id
    });

    if (existingRecommendation) {
      return res.status(400).json({
        error: 'You have already recommended this property to this user'
      });
    }

    const recommendation = await Recommendation.create({
      property: propertyId,
      from: req.user.id,
      to: recipient.id,
      message
    });

    await clearCache('api:/api/recommendations*');


    res.status(201).json({
      data: recommendation
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const markRecommendationViewed=async(req,res)=>{
    try {
    const recommendation = await Recommendation.findOneAndUpdate(
      {
        _id: req.params.id,
        to: req.user.id,
        status: 'pending'
      },
      { status: 'viewed' },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found or already viewed'
      });
    }

    await clearCache('api:/api/recommendations*');


    res.json({
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

module.exports={getReceivedRecommendations,getSentRecommendations,createRecommendation,markRecommendationViewed};