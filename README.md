# blog-app
my blog-app

tech stack : Next JS, Tailwind, Zod, Tanstack Query

Blog App API Summary
1. Authentication

POST /auth/register - Register new user
Body: name, email, password
POST /auth/login - User login and get JWT token
Body: email, password

2. Users

GET /users/me - Get current user data (requires Authorization Bearer Token)
GET /users/{id} - Get user profile by ID
PATCH /users/me - Update user profile (name, headline, avatar)

3. Posts

GET /posts - Get all posts
GET /posts/recommended - Get recommended posts
GET /posts/most-liked - Get most liked posts
GET /posts/search?query= - Search posts by query string
GET /posts/{id} - Get post details by ID
POST /posts - Create new post (requires Content-Type: multipart/form-data)
Fields: title, content, tags, image (PNG/JPG)
DELETE /posts/{id} - Delete post by ID (requires Authorization)
GET /posts/{id}/likes - Get list of users who liked the post
GET /posts/{id}/comments - Get post comments by ID

4. Comments

POST /comments/{postId} - Add comment to post by ID
Body: userId, content
GET /comments/{postId} - Get comments list for specific post

5. Additional Notes

All endpoints that modify or delete data require Authorization Bearer Token
Response format is typically JSON
For image upload, use multipart/form-data with "image" key
Authorization: Bearer {token} must be included in headers for protected endpoints
