const Property = require('../models/Property');
const { clearCache } = require('../middleware/cache');



const getProperties=async(req,res)=>{
    try {
    const query = {};
    const {
      minPrice, maxPrice, bedrooms, bathrooms, propertyType,
      city, state, listingType, minSquareFootage, maxSquareFootage
    } = req.query;

    // Build filter query
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (bathrooms) query.bathrooms = parseFloat(bathrooms);
    if (propertyType) query.propertyType = propertyType;
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (listingType) query.listingType = listingType;
    if (minSquareFootage || maxSquareFootage) {
      query.squareFootage = {};
      if (minSquareFootage) query.squareFootage.$gte = parseInt(minSquareFootage);
      if (maxSquareFootage) query.squareFootage.$lte = parseInt(maxSquareFootage);
    }

    const properties = await Property.find(query)
      .populate('createdBy', 'name email');

    res.json({
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

const createProperty=async(req,res)=>{
    try {
      
        req.body.createdBy = req.user.id;
        const property = await Property.create(req.body);
        await clearCache('api:/api/properties*');

        res.status(201).json({data:property});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const updateProperty=async(req,res)=>{
    try {
         const property = await Property.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        await clearCache('api:/api/properties*');

        res.json({data: property});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const deleteProperty=async(req,res)=>{
    try {
        await Property.findByIdAndDelete(req.params.id);
        await clearCache('api:/api/properties*');
        res.json({message:'Property deleted successfully'});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports={getProperties,createProperty,updateProperty,deleteProperty};