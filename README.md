# To-Do App - MERN Stack

A full-featured To-Do tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Features

-   User authentication with JWT (signup/login)
-   Email notifications (welcome email on signup, login notification)
-   Create, read, update, and delete tasks
-   Task attributes: title, description, due date, category, priority, status
-   View tasks in multiple ways:
    -   All Tasks (list/grid view)
    -   Today's Tasks
    -   Completed Tasks (Archive)
    -   Kanban Board
-   Search tasks by title
-   Mark tasks as completed
-   View overdue tasks

### Admin Features

-   Admin dashboard with analytics
-   View all users and their task statistics
-   View all tasks from all users
-   Assign tasks to users
-   Reports and charts:
    -   Total tasks and users
    -   Average tasks per user
    -   Task status distribution (pie chart)
    -   Weekly task comparison
    -   User completion rates

### Technical Features

-   JWT authentication with role-based access control (Admin/User)
-   API interceptors for token management
-   Axios for HTTP requests
-   Framer Motion animations
-   Tailwind CSS with blue/white theme
-   Responsive design
-   Email integration with Nodemailer

## Tech Stack

### Frontend

-   React 19
-   Vite
-   React Router DOM
-   Tailwind CSS
-   Framer Motion
-   Axios
-   Recharts (for dashboard charts)
-   Lucide React (icons)

### Backend

-   Node.js
-   Express.js
-   MongoDB with Mongoose
-   JWT authentication
-   Bcrypt.js for password hashing
-   Nodemailer for email
-   Express Validator

## Installation

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB Atlas account or local MongoDB instance

### Server Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

CLIENT_URL=http://localhost:5173
```

5. Start the server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

### Client Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Creating Users

1. Navigate to the signup page
2. Fill in your details (name, email, password)
3. Select role (User or Admin)
4. Click "Sign Up"

### Regular User Workflow

1. Login with your credentials
2. Create tasks using the "New Task" button
3. View tasks on different pages:
    - **All Tasks**: See all your tasks
    - **Today**: Tasks due today and overdue tasks
    - **Kanban**: Drag-and-drop board view
    - **Archive**: Completed tasks
4. Edit, delete, or mark tasks as complete
5. Search for tasks using the search bar

### Admin Workflow

1. Login with admin credentials
2. Access the admin dashboard
3. View analytics and reports
4. Manage users and their tasks
5. Assign tasks to users
6. View comprehensive statistics

## API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/profile` - Get user profile

### Tasks

-   `GET /api/tasks` - Get all tasks (filtered by user role)
-   `GET /api/tasks/today` - Get today's tasks
-   `GET /api/tasks/completed` - Get completed tasks
-   `GET /api/tasks/overdue` - Get overdue tasks
-   `GET /api/tasks/:id` - Get single task
-   `POST /api/tasks` - Create new task
-   `PUT /api/tasks/:id` - Update task
-   `DELETE /api/tasks/:id` - Delete task

### Admin (Protected)

-   `GET /api/admin/stats` - Get dashboard statistics
-   `GET /api/admin/users` - Get all users
-   `GET /api/admin/tasks` - Get all tasks
-   `GET /api/admin/user-stats` - Get user task statistics

## Email Configuration

To enable email notifications:

1. For Gmail, enable 2-factor authentication
2. Generate an app-specific password
3. Update the `.env` file with your Gmail credentials

## Project Structure

```
To-Do/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utilities (API setup)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & error middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utilities (email, JWT)
│   ├── index.js         # Entry point
│   └── package.json
│
└── README.md
```

## Security Features

-   Password hashing with bcrypt
-   JWT token authentication
-   Protected routes on frontend and backend
-   Role-based access control
-   Input validation and sanitization
-   CORS configuration

## Development Notes

-   No Redux - uses React Context for state management
-   Modular code structure for maintainability
-   API interceptors for centralized error handling
-   Responsive design with Tailwind CSS
-   Smooth animations with Framer Motion

## License

MIT
