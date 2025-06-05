HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
