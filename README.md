# Todo App

A full-stack todo application with React frontend and FastAPI backend, featuring JWT authentication and MongoDB storage.

## Features

- **Task Management**: Create, read, update, delete, and toggle completion status
- **User Authentication**: Secure JWT-based registration and login
- **Real-time Updates**: Responsive UI with instant feedback
- **Data Persistence**: MongoDB database storage
- **Secure**: Password hashing, token-based authentication, CORS protection

## Tech Stack

### Frontend
- **React 19** with hooks
- **Vite** for development and building
- **Lucide React** for icons
- **CryptoJS** for client-side encryption
- **CSS3** for styling

### Backend
- **FastAPI** with async support
- **MongoDB** with Motor (async driver)
- **JWT** authentication with python-jose
- **Pydantic** for data validation
- **Passlib** with bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js v20+ and npm
- Python 3.8+
- MongoDB instance (local or cloud)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set environment variables (create `.env` file):
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=todoapp
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
APP_HOST=localhost
APP_PORT=8000
DEBUG=True
```

5. Start the server:
```bash
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/tasks/` - Get user tasks
- `POST /api/tasks/` - Create new task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

## Project Structure

```
todo/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── utils/             # API and auth utilities
│   └── App.jsx            # Main app component
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Pydantic models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Database and auth utilities
│   └── main.py           # FastAPI application
└── package.json          # Frontend dependencies
```

## Development

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Commands
```bash
python main.py             # Start development server
uvicorn main:app --reload  # Alternative start command
```

## Deployment

The application is configured for Vercel deployment with:
- Frontend: Automatic Vite build and deployment
- Backend: Serverless function deployment
- CORS: Pre-configured for Vercel domains

## Environment Variables

### Backend (.env)
- `MONGODB_URL` - MongoDB connection string
- `DATABASE_NAME` - Database name
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS (optional)
- `DEBUG` - Enable debug mode (True/False)

## License
Released under an open spirit—use, modify, and build upon this project freely to spark your own ideas.