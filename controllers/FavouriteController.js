const Favourite = require('../models/Favourite');
const { clearCache } = require('../middleware/cache');


const getFavourites=async(req,res)=>{
    try {
    const favourites = await Favourite.find({ user: req.user.id })
      .populate('property');

    res.json({
      count: favourites.length,
      data: favourites
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

const addFavourites=async(req,res)=>{
    try {
    req.body.user = req.user.id;
    const favourite = await Favourite.create(req.body);
    await clearCache(`api:/api/favourites*`);

    res.status(201).json({
      data: favourite
    });
  } catch (error) {
    // Handle duplicate favourite
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Property already favourited'
      });
    }
    res.status(400).json({
      error: error.message
    });
  }
}

const updateFavourites=async(req,res)=>{
    try {
    const favourite = await Favourite.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { notes: req.body.notes },
      { new: true, runValidators: true }
    );

    if (!favourite) {
      return res.status(404).json({
        success: false,
        error: 'Favourite not found'
      });
    }
    await clearCache(`api:/api/favourites*`);

    res.json({
      data: favourite
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const deleteFavourites=async(req,res)=>{
    try {
    const favourite = await Favourite.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!favourite) {
      return res.status(404).json({
        success: false,
        error: 'Favourite not found'
      });
    }

    await clearCache(`api:/api/favourites*`);


    res.json({
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

module.exports={getFavourites,addFavourites,updateFavourites,deleteFavourites};