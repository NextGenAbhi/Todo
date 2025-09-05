# Personal Todo List Application

A beautiful, secure, and feature-rich todo list application built with React and Vite. This application prioritizes security and privacy by storing all data locally on your device with strong encryption.

## 🌟 Features

### Core Features
- ✅ **Add, Edit, Delete Tasks** - Complete task management functionality
- ✅ **Mark Tasks as Complete** - Toggle task completion status
- ✅ **Search Tasks** - Find tasks quickly with real-time search
- ✅ **Filter Tasks** - View all, active, or completed tasks
- ✅ **Task Statistics** - See total, active, and completed task counts

### Security Features
- 🔐 **User Authentication** - Secure email/password login system
- 🔒 **Local Data Encryption** - All data encrypted using AES encryption
- 🛡️ **Session-based Security** - Secure session management
- 🔑 **Password Hashing** - Passwords are hashed using SHA-256
- 💾 **Local Storage Only** - No data sent to external servers

### UI/UX Features
- 🎨 **Beautiful Modern Design** - Clean and intuitive interface
- 📱 **Responsive Design** - Works perfectly on all device sizes
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preference
- ⚡ **Smooth Animations** - Delightful transitions and interactions
- ♿ **Accessibility** - Full keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

You need to have Node.js version 20.19+ or 22.12+ installed on your system.

**Current Requirement Issue**: Your system has Node.js v16.18.1, but this project requires Node.js 20.19+ or 22.12+.

### Installation Options

#### Option 1: Upgrade Node.js (Recommended)

1. **Update Node.js** to version 20 or higher:
   ```bash
   # Using Node Version Manager (nvm) - recommended
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc  # or ~/.zshrc
   nvm install 20
   nvm use 20
   
   # Or download from https://nodejs.org/
   ```

2. **Install dependencies and run**:
   ```bash
   cd /Users/abhishekanand/Documents/reactApp/todo
   npm install
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

#### Option 2: Use Alternative Server (Current Setup)

Since Vite requires a newer Node.js version, you can build the project and serve it using Python:

1. **Build the project** (this might work with Node 16):
   ```bash
   npm run build
   ```

2. **Serve using Python**:
   ```bash
   cd dist
   python3 -m http.server 8000
   # Or with Python 2: python -m SimpleHTTPServer 8000
   ```

3. **Open your browser** and navigate to `http://localhost:8000`

## 🔐 Security Features Explained

### Encryption
- **AES Encryption**: All user data is encrypted using the Advanced Encryption Standard
- **Session Keys**: Unique encryption keys generated for each browser session
- **No Plain Text Storage**: Passwords and tasks are never stored in plain text

### Privacy
- **Local Only**: All data stays on your device - nothing is sent to external servers
- **No Tracking**: No analytics, cookies, or tracking mechanisms
- **Secure Sessions**: Authentication state cleared when browser is closed

### Data Protection
- **Password Hashing**: Passwords are hashed using SHA-256 before encryption
- **Secure Storage**: localStorage and sessionStorage used with encryption
- **Memory Protection**: Sensitive data cleared from memory when possible

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthForm.jsx      # Login/Registration component
│   └── TodoApp.jsx       # Main todo application component
├── utils/
│   ├── auth.js          # Authentication utilities
│   └── storage.js       # Secure storage utilities
├── App.jsx              # Root application component
├── App.css              # Main application styles
├── index.css            # Global styles
└── main.jsx             # Application entry point
```

## 🎨 Technologies Used

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **CryptoJS** - Encryption and security utilities
- **Lucide React** - Beautiful, customizable icons
- **CSS3** - Modern CSS with custom properties and grid/flexbox
- **localStorage/sessionStorage** - Browser storage APIs

## 📱 Usage Guide

### First Time Setup
1. Open the application
2. Click "Create Account" 
3. Enter your email and password
4. Your account is created and encrypted locally

### Daily Usage
1. Sign in with your credentials
2. Add tasks using the input field
3. Click the circle to mark tasks as complete
4. Use the edit button to modify tasks
5. Use the delete button to remove tasks
6. Search and filter tasks as needed

### Security Best Practices
- Use a strong, unique password
- Don't share your device with others while logged in
- Log out when finished using the app
- Keep your browser updated for security

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Guidelines

1. **Code Style**: Follow the existing code patterns
2. **Security**: Always encrypt sensitive data before storage
3. **Accessibility**: Maintain keyboard navigation and ARIA labels
4. **Responsive**: Test on various screen sizes
5. **Performance**: Optimize for fast loading and smooth interactions

## 🐛 Troubleshooting

### Common Issues

1. **Node.js Version Error**
   - Solution: Upgrade to Node.js 20+ or use Python server method

2. **Tasks Not Saving**
   - Check browser console for errors
   - Ensure localStorage is enabled
   - Try refreshing the page

3. **Login Issues**
   - Verify correct email and password
   - Check if data was corrupted (use dev tools to clear localStorage)

4. **Styling Issues**
   - Hard refresh the browser (Ctrl/Cmd + Shift + R)
   - Check if CSS files loaded properly

### Development Issues

1. **Build Failures**
   - Run `npm install` to ensure dependencies are installed
   - Check Node.js version compatibility

2. **Linting Errors**
   - Run `npm run lint` to see all issues
   - Follow ESLint recommendations

## 🔄 Data Management

### Backup Your Data
Since data is stored locally, consider backing up your tasks:

1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Find localStorage entries starting with "todo_"
4. Copy the encrypted data to a safe location

### Clear All Data
If you need to reset the application:

```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🚀 Future Enhancements

Potential features for future versions:
- Import/Export functionality
- Task categories and tags
- Due dates and reminders
- Task priorities
- Subtasks and task hierarchies
- Backup to cloud storage (encrypted)
- PWA support for offline usage

## 📄 License

This project is for personal use. Feel free to modify and adapt it to your needs.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Encryption powered by [CryptoJS](https://cryptojs.gitbook.io/)

---

**Note**: This application is designed for personal use and prioritizes privacy and security. All data remains on your local device and is never transmitted to external servers.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
