# Todo App Backend

A secure FastAPI backend for the Todo application with JWT authentication and MongoDB integration.

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **Authorization**: User-specific task management
- **Database**: MongoDB integration with async operations
- **Security**: Environment-based configuration for sensitive data
- **API Design**: RESTful API following MVC architecture
- **CORS**: Configured for frontend integration

## Prerequisites

- Python 3.8+
- MongoDB Atlas account or local MongoDB instance
- pip (Python package manager)

## Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   - Copy `.env` file and update the values:
   - Set `MONGODB_URI` with your actual MongoDB connection string
   - Replace `<db_password>` with your actual database password
   - Generate a secure `SECRET_KEY` for JWT tokens

5. **Start the server**:
   ```bash
   python main.py
   ```
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host localhost --port 8000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `POST /api/auth/verify-token` - Verify JWT token

### Tasks
- `GET /api/tasks/` - Get all user tasks
- `POST /api/tasks/` - Create a new task
- `GET /api/tasks/{task_id}` - Get specific task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task
- `PATCH /api/tasks/{task_id}/toggle` - Toggle task completion

## Project Structure

```
backend/
├── app/
│   ├── controllers/          # Business logic (MVC Controllers)
│   │   ├── auth_controller.py
│   │   └── task_controller.py
│   ├── models/              # Data models (Pydantic)
│   │   ├── user.py
│   │   └── task.py
│   ├── routes/              # API routes
│   │   ├── auth.py
│   │   └── tasks.py
│   └── utils/               # Utilities
│       ├── auth.py          # JWT & password utilities
│       ├── database.py      # Database connection
│       └── dependencies.py  # FastAPI dependencies
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── README.md               # This file
```

## Security Features

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Environment Variables**: Sensitive data stored in environment variables
- **User Isolation**: Each user can only access their own tasks
- **Input Validation**: Pydantic models for request/response validation

## Development

- The server runs with auto-reload enabled in development mode
- API documentation available at: http://localhost:8000/docs
- Health check endpoint: http://localhost:8000/health

## Production Deployment

1. Set `DEBUG=False` in production
2. Use a strong `SECRET_KEY`
3. Configure proper CORS origins
4. Use environment variables for all sensitive configuration
5. Consider using a process manager like supervisor or systemd
