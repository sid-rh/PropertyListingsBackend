const express=require('express');
const router=express.Router();
const { protect, checkOwnership } = require('../middleware/auth');
const {getProperties,createProperty,updateProperty,deleteProperty}=require('../controllers/PropertyController');
const Property=require('../models/Property');
const { cache } = require('../middleware/cache');



router.get('/', cache(300), getProperties);
router.post('/',protect,createProperty);
router.put('/:id',protect,checkOwnership(Property),updateProperty);
router.delete('/:id',protect,checkOwnership(Property),deleteProperty);

module.exports=router;