const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

const connectDB = require('./config/db');
const { setupRedis } = require('./config/redis');

const authRoutes=require('./routes/AuthRoutes');
const propertyRoutes=require('./routes/PropertyRoutes');
const favouriteRoutes=require('./routes/FavouriteRoutes');
const recommendationRoutes=require('./routes/RecommendationRoutes');

connectDB();
setupRedis();

app.use('/api/auth',authRoutes);
app.use('/api/properties',propertyRoutes);
app.use('/api/favourites',favouriteRoutes);
app.use('/api/recommendations',recommendationRoutes);

const PORT=process.env.PORT||8000;
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})