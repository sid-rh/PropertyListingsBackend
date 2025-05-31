const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { cache } = require('../middleware/cache');


const {
    getReceivedRecommendations,
    getSentRecommendations,
    createRecommendation,
    markRecommendationViewed
    } = require('../controllers/RecommendationController');

router.get('/received',protect,cache(300),getReceivedRecommendations);
router.get('/sent',protect,cache(300),getSentRecommendations);
router.post('/',protect,createRecommendation);
router.put('/:id/view',protect,markRecommendationViewed);

module.exports=router;
