# To-Do App - Quick Setup Guide

## Complete Implementation Summary

All features from the assignment have been successfully implemented! Here's what's included:

### ✅ Core Features Implemented

1. **User Authentication**

    - JWT-based authentication
    - Signup and Login pages
    - Email notifications (welcome email + login notification)
    - Role-based access (Admin/User)

2. **Task Management**

    - Create, edit, delete tasks
    - Task fields: title, description, due date, category, priority, status
    - Mark tasks as completed
    - Assign tasks (admin feature)

3. **Multiple Views**

    - All Tasks (list/grid view)
    - Today's Tasks (with overdue section)
    - Archive (completed tasks)
    - Kanban Board (drag-and-drop style)

4. **Search Functionality**

    - Search tasks by title/name

5. **Admin Dashboard**

    - Total tasks count
    - Total users count
    - Average tasks per user (last 7 days)
    - Task distribution pie chart
    - Weekly comparison (last 7 days vs previous 7 days)
    - User management with statistics
    - View all tasks from all users

6. **Additional Features**
    - Overdue task detection
    - Framer Motion animations
    - Blue/White theme with Tailwind CSS
    - Responsive design
    - API interceptors
    - Protected routes

## How to Run

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd client
npm run dev
```

The app will open at `http://localhost:5173`

## Important Configuration

### Email Setup (Nodemailer)

Update `server/.env` with your Gmail credentials:

1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Update these fields:
    ```
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASSWORD=your_app_password
    ```

**Note:** The app will work without email configuration, but welcome/login emails won't be sent.

### MongoDB Connection

Your MongoDB connection is already configured in `server/.env`:

```
MONGODB_URI=your_mongodb_url
```

### JWT Secret

For production, update the JWT secret in `server/.env`:

```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

## Testing the Application

### 1. Create Users

**Admin User:**

-   Go to signup page
-   Name: Admin User
-   Email: admin@example.com
-   Password: admin123
-   Role: Admin

**Regular User:**

-   Go to signup page
-   Name: John Doe
-   Email: john@example.com
-   Password: user123
-   Role: User

### 2. Test User Features

Login as regular user and:

-   Create tasks with different priorities and categories
-   View tasks on different pages (All, Today, Kanban, Archive)
-   Mark tasks as completed
-   Search for tasks
-   Edit and delete tasks

### 3. Test Admin Features

Login as admin and:

-   View dashboard analytics
-   Check task distribution chart
-   View weekly comparison
-   Go to Users page to see user statistics
-   Assign tasks to users
-   View all tasks from all users

## Project Structure

```
To-Do/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx     # Navigation and layout
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AllTasks.jsx
│   │   │   ├── TodayTasks.jsx
│   │   │   ├── Archive.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   └── AdminTasks.jsx
│   │   ├── utils/
│   │   │   └── api.js         # Axios setup with interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT & role verification
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── emailService.js    # Nodemailer configuration
│   │   └── generateToken.js
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md
└── .gitignore
```

## API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/profile` - Get user profile (protected)

### Tasks (Protected)

-   `GET /api/tasks` - Get all tasks
-   `GET /api/tasks/today` - Get today's tasks
-   `GET /api/tasks/completed` - Get completed tasks
-   `GET /api/tasks/overdue` - Get overdue tasks
-   `GET /api/tasks/:id` - Get single task
-   `POST /api/tasks` - Create new task
-   `PUT /api/tasks/:id` - Update task
-   `DELETE /api/tasks/:id` - Delete task

### Admin (Protected - Admin Only)

-   `GET /api/admin/stats` - Dashboard statistics
-   `GET /api/admin/users` - All users
-   `GET /api/admin/tasks` - All tasks
-   `GET /api/admin/user-stats` - User task statistics

## Tech Stack Summary

**Frontend:**

-   React 19 + Vite
-   React Router DOM
-   Tailwind CSS
-   Framer Motion
-   Axios with interceptors
-   Recharts (pie chart)
-   Lucide React (icons)

**Backend:**

-   Node.js + Express.js
-   MongoDB + Mongoose
-   JWT authentication
-   Bcrypt.js
-   Nodemailer
-   Express Validator
-   CORS

## Key Features Highlight

1. **Modular Architecture** - Clean separation of concerns
2. **No Redux** - Simple Context API for state management
3. **API Interceptors** - Centralized token management and error handling
4. **Role-Based Access** - Admin and User roles with different permissions
5. **Email Integration** - Welcome and login notifications
6. **Analytics Dashboard** - Comprehensive reports for admin
7. **Multiple Views** - List, Grid, Kanban, and filtered views
8. **Search** - Find tasks by title
9. **Animations** - Smooth transitions with Framer Motion
10. **Blue/White Theme** - Clean, professional design

## Troubleshooting

**MongoDB Connection Issues:**

-   Ensure your MongoDB connection string is correct
-   Check if your IP is whitelisted in MongoDB Atlas
-   Verify network connectivity

**Port Already in Use:**

-   Backend: Change PORT in `server/.env`
-   Frontend: Vite will automatically suggest another port

**Email Not Sending:**

-   Verify Gmail app password is correct
-   Check EMAIL_USER and EMAIL_PASSWORD in `server/.env`
-   Ensure 2FA is enabled on Gmail

## Next Steps for Production

1. Change JWT_SECRET to a strong secret key
2. Set up proper email service credentials
3. Configure MongoDB for production
4. Add error logging service
5. Set up environment-specific configs
6. Add input sanitization
7. Implement rate limiting
8. Add comprehensive error messages
9. Set up CI/CD pipeline
10. Deploy to cloud service (Vercel/Netlify for frontend, Railway/Render for backend)

---

**Your To-Do App is ready to use! 🎉**

All assignment requirements have been implemented successfully.
