const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {getFavourites,addFavourites,updateFavourites,deleteFavourites} = require('../controllers/FavouriteController');
const { cache } = require('../middleware/cache');


router.get('/',protect,cache(300),getFavourites);
router.post('/',protect,addFavourites);
router.put('/:id',protect,updateFavourites);
router.delete('/:id',protect,deleteFavourites);

module.exports=router;
