# Learning Point

## Description
Learning Point is an online course-selling platform where users can browse, purchase, and access courses. It offers secure payments, video-based learning, and user authentication. Instructors can upload courses, while students can track progress and engage with content. The platform ensures security through token-based authentication and role-based access control.

## Tech Stack
### Frontend:
- React
- React Router
- Tailwind CSS
- DaisyUI
- TanStack Query (React Query)
- Axios
- React Hook Form

### Backend:
- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT)

### Authentication:
- Firebase

### Payment Processing:
- Stripe

### Video and Image Storage:
- Cloudinary

## Features
### User Authentication & Security
- Secure login system with Firebase authentication.
- Account creation and recovery system.
- Dynamic token generation with a validity of 6 hours.
- Automatic token refresh if the user is active within the expiration period.
- Token expiration check every 5 minutes to maintain session security.
- Role-based access control (Student, Instructor, Admin).
- Suspended users cannot access secure content.
- Secure API communication using JWT authentication.

### Dashboard & User Roles
- **Dynamic dashboards** tailored for students, instructors, and admins with different permissions.
- **Students:**
  - Can browse courses, add to wishlist or cart, and purchase securely via Stripe.
  - View purchase history with receipts and provide feedback.
  - Access purchased courses and track learning progress.
  - Submit and edit course reviews.
- **Instructors:**
  - Can upload and manage courses, including updating, deleting, and temporarily unpublishing.
  - View total revenue, sales count, and statistics (lifetime, yearly, and monthly sales data).
  - Analyze reviews with a breakdown of 1-5 star ratings.
  - Monitor enrolled students, course completions, and total reviews.
  - Receive feedback from admins regarding course approval or rejection.
  - Search and view student reviews.
- **Admins:**
  - Monitor platform-wide revenue and sales statistics (lifetime, yearly, and monthly data).
  - Approve, deny, or provide feedback on instructor courses.
  - Manage users: Promote/demote roles (Student, Instructor, Admin) and suspend accounts.
  - Track suspended users, reasons for suspension, and admin responsible.
  - Update homepage banner images for static content management.

### Course & Content Management
- Courses categorized by popularity, rating, review count, and completion rate.
- Instructor details page showing instructor bio and all their courses.
- Students can see full course details, including syllabus, duration, and reviews.
- Real-time star ratings with dynamic fill.
- Courses page displaying real-time course duration and ratings.

### Video & Media Integration
- Video playback using Cloudinary and Video.js.
- Securely stored videos to prevent unauthorized access.
- Image uploads and updates via Cloudinary.

### Search & Discovery
- Advanced search functionality to find courses efficiently.
- Featured sections:
  - Popular courses based on total enrolled students, reviews, and completion rates.
  - Top instructors ranked by course ratings and student enrollments.
  - Real-time testimonials displayed on the homepage for better engagement.

### Payment System
- Secure payment processing via Stripe.
- Students receive digital receipts after successful transactions.

### Responsive & Performance Optimization
- Fully responsive UI, optimized for all devices.
- Fast and smooth Single Page Application (SPA) experience using React Router.

## Installation & Setup
### Prerequisites:
- Node.js and npm installed.
- Firebase project set up.
- MongoDB database.
- Cloudinary account.
- Stripe account for payment processing.

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/Shihab066/learning-client.git
   cd learning-client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env.local` file):
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_auth_domain
   VITE_projectId=your_project_id
   VITE_storageBucket=your_storage_bucket
   VITE_messagingSenderId=your_messaging_sender_id
   VITE_appId=your_app_id
   VITE_PAYMENT_KEY=your_stripe_secret_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
- The client-side can be deployed on platforms like Vercel or Netlify.
- Ensure backend APIs are properly hosted and accessible.

## Contact

Foysal - [foysal.hossain.cs@gmail.com](mailto:foysal.hossain.cs@gmail.com)
