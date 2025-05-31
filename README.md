# Property Listing API

A backend system for managing property listings with features like user authentication, property management, favorites, and recommendations.

## Features

- User authentication (register/login)
- Property CRUD operations with ownership validation
- Advanced property filtering
- Favorite properties management
- Property recommendations between users
- Redis caching for optimized performance
- MongoDB for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000

MONGODB_URI=<your-mongdb-uri>
JWT_SECRET= your-secret-key

REDIS_USERNAME = <your-redis-username>
REDIS_PASSWORD = <your-redis-password>
REDIS_HOST = <your-redis-host>
REDIS_PORT = <your-redis-port>
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sid-rh/PropertyListingsBackend
```
2. Install dependencies:
```bash
npm install
```
3. Import sample data (optional):
```bash
node utils/ImportCsv
```

**Important Note**: Running the import script will delete all existing property data in the database before importing the new data. Make sure to backup any existing data if needed.

4. Start the server:
```bash
npm run dev
```

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Properties

#### Get All Properties
```http
GET /api/properties
```

Query Parameters:
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `propertyType`: Type of property
- `city`: City name
- `state`: State name
- `minSquareFootage`: Minimum area
- `maxSquareFootage`: Maximum area

#### Create Property
```http
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId":"PROP2000",  
  "title": "Sea View",
  "type":"Apartment",
  "price": 45000000,
  "state": "Maharashtra",
  "city":"Mumbai",
  "areaSqFt": 1000,
  "bedrooms": 2,
  "bathrooms": 2,
  "amenities": ["Playground","Garden","Gym"],
  "furnished": "Semi",
  "availableFrom": "2025-10-07",
  "listedBy": "Agent",
  "tags": ["Sea Facing","gated community"],
  "colorTheme": "#f4f1d3",
  "rating": 4,
  "isVerified": true,
  "listingType": "sale"
}
```

#### Update Property
```http
PUT /api/properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 65000000
}
```

#### Delete Property
```http
DELETE /api/properties/:id
Authorization: Bearer <token>
```

### Favorites

#### Get User's Favorites
```http
GET /api/favourites
Authorization: Bearer <token>
```

#### Add to Favorites
```http
POST /api/favourites
Authorization: Bearer <token>
Content-Type: application/json

{
  "property": "property_id",
  "notes": "Perfect location!"
}
```

#### Update Favorite Notes
```http
PUT /api/favourites/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Nice property by the sea"
}
```

#### Remove from Favorites
```http
DELETE /api/favourites/:id
Authorization: Bearer <token>
```

### Recommendations

#### Get Received Recommendations
```http
GET /api/recommendations/received
Authorization: Bearer <token>
```

#### Get Sent Recommendations
```http
GET /api/recommendations/sent
Authorization: Bearer <token>
```

#### Create Recommendation
```http
POST /api/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "property_id",
  "recipientEmail": "user@example.com",
  "message": "Check out this amazing property!"
}
```

#### Mark Recommendation as Viewed
```http
PUT /api/recommendations/:id/view
Authorization: Bearer <token>
```

