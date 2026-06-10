# 🌐 EchoVerse - Social Media Platform

A modern, scalable social media platform built with Node.js, Express, and MongoDB. Connect with users, share posts, and build your community.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with password hashing
- **User Profiles**: Customizable profiles with avatar, bio, location, and website
- **Social Connections**: Follow/unfollow system with follower and following counts
- **Feed System**: Personalized feed showing posts from followed users
- **Post Management**: Create, read, update, delete posts with visibility controls
- **Interactions**: Like posts, write comments, and engage with content
- **Direct Messaging**: Real-time messaging between users
- **Rate Limiting**: Built-in protection against abuse
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/johnathanleech2016-lang/EchoVerse.git
cd EchoVerse

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# - DATABASE_URL: Your MongoDB connection string
# - JWT_SECRET: Secret key for JWT tokens
# - CORS_ORIGIN: Frontend URL for CORS

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Posts

#### Create Post
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Hello EchoVerse! 🎉",
  "visibility": "public"
}
```

#### Get Feed
```http
GET /api/posts/feed?skip=0&limit=20
Authorization: Bearer {token}
```

#### Like Post
```http
POST /api/posts/{postId}/like
Authorization: Bearer {token}
```

#### Unlike Post
```http
POST /api/posts/{postId}/unlike
Authorization: Bearer {token}
```

### Users

#### Get User Profile
```http
GET /api/users/{userId}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer & coffee enthusiast",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com"
}
```

#### Follow User
```http
POST /api/users/{userId}/follow
Authorization: Bearer {token}
```

#### Get Followers
```http
GET /api/users/{userId}/followers?skip=0&limit=20
```

#### Get Following
```http
GET /api/users/{userId}/following?skip=0&limit=20
```

## 🏗️ Project Structure

```
EchoVerse/
├── src/
│   ├── config/           # Configuration files (database, etc.)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── docs/                # Documentation
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── README.md           # This file
```

## 🗄️ Database Models

### User
- username, email, password
- profile (firstName, lastName, bio, avatar, coverImage, location, website)
- social (followers, following, counts)
- privacy settings

### Post
- author, content, image/video
- likes, comments, shares
- visibility (public, followers, private)
- timestamps

### Comment
- author, content
- likes, replies
- timestamps

### Message
- sender, recipient, content
- read status, timestamps

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- CORS protection
- Helmet.js for HTTP headers
- Rate limiting (configurable)
- Input validation

## 📦 Environment Variables

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/echoverse

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_AUTH=5
RATE_LIMIT_API=100
RATE_LIMIT_PUBLIC=30
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Deploy to Heroku
```bash
heroku create echoverse-app
heroku addons:create mongolab:sandbox
git push heroku main
```

### Deploy to Railway
```bash
railway link
railway up
```

### Deploy to Vercel (Frontend)
Frontend should be deployed separately to Vercel, Netlify, or similar.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, reach out to [johnathanleech2016-lang](https://github.com/johnathanleech2016-lang)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB community
- Open source contributors

---

**Made with ❤️ by EchoVerse Team**