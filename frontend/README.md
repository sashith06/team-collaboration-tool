# Team Collaboration Tool - Frontend

A modern React-based frontend for a Team Collaboration Tool (similar to Trello) with Kanban-style project management capabilities.

## 🚀 Current Status

✅ **Phase 1 Complete**: Basic project structure and Registration page UI  
⏳ **Phase 2 Coming**: Backend integration and additional pages  
⏳ **Phase 3 Coming**: Kanban boards with drag & drop functionality  

## 🛠️ Tech Stack

- **React** 19.1.1 (JavaScript only - no TypeScript)
- **React Router DOM** 7.9.1 - Client-side routing
- **Tailwind CSS** 4.1.13 - Styling and responsive design
- **Vite** 7.1.7 - Build tool and dev server
- **Axios** 1.12.2 - HTTP client (ready for API integration)
- **Context API** - State management for authentication

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable React components
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Registration.jsx
│   │   ├── Dashboard.jsx
│   │   └── index.js
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx
│   ├── utils/               # Utility functions
│   │   └── api.js
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## 🎯 Features Implemented

### ✅ Authentication System
- **Registration Page**: Complete with form validation
  - Full name, email, password, and confirm password fields
  - Client-side validation with error messages
  - Responsive design with Tailwind CSS
  - Integration with AuthContext

- **Login Page**: User authentication interface
  - Email and password fields
  - Form validation and error handling
  - "Remember me" checkbox
  - Links between login and registration

- **Auth Context**: Centralized authentication state management
  - User state management
  - Login/logout functionality
  - Authentication status tracking
  - Protected route handling

### ✅ Navigation & Routing
- **React Router Setup**: Complete routing configuration
  - Protected routes for authenticated users
  - Public routes with redirect logic
  - Navigation guards

- **Protected Routes**: Route protection component
  - Authentication checking
  - Loading states
  - Redirect to login when unauthenticated

### ✅ UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Spinner animations during async operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation with real-time feedback

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - The app will be available at `http://localhost:5174/` (currently running)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📱 Current User Flow

1. **Landing**: Visitors are redirected to login page
2. **Registration**: New users can create accounts
   - Form validation ensures data quality
   - Successful registration automatically logs user in
3. **Login**: Existing users can sign in
   - Credentials are validated client-side
   - Successful login redirects to dashboard
4. **Dashboard**: Authenticated users see placeholder dashboard
   - Welcome message with user name
   - Logout functionality
   - Feature preview of upcoming capabilities

## 🚀 Next Steps (Phase 2)

1. **Backend Integration**:
   - Connect to actual authentication API
   - Replace mock login/registration with real endpoints
   - Add proper JWT token handling

2. **Dashboard Enhancement**:
   - User profile management
   - Project listing and creation
   - Recent activity feed

3. **Project Management**:
   - Create project page
   - Project settings and permissions
   - Project invitation system

## 📋 Future Features (Phase 3+)

- **Kanban Boards**: Drag & drop task management
- **Task Management**: Create, edit, delete tasks
- **Comments System**: Task discussion and collaboration
- **Real-time Updates**: WebSocket integration
- **File Attachments**: Document and image uploads
- **Notifications**: In-app and email notifications
- **Team Management**: User roles and permissions

---

**Note**: This is the frontend-only implementation. Backend integration will be added in the next phase of development.
