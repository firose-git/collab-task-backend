# Collaborative Task Manager

A full-stack real-time task management application built with the MERN stack (MongoDB, Express, React, Node.js) + TypeScript.

## 🚀 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (Server State), Context API (Auth State)
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.io
- **Validation**: Zod
- **Auth**: JWT (HttpOnly Cookies)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Atlas)
- Docker (optional)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/firose-git/collab-task-backend.git
   cd collaborative-task-manager
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file if not exists (see .env.example or below)
   npm run build
   npm run dev
   ```
   *Backend runs on port 5000*

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run build
   npm run dev
   ```
   *Frontend runs on port 5173*

### Docker Setup (Bonus)

Run the entire stack with a single command:

```bash
docker-compose up --build
```
Access frontend at `http://localhost:5173`.

## 📊 Feature Analysis

| Feature | Status | Implementation Details |
| :--- | :--- | :--- |
| **Authentication** | ✅ Completed | JWT-based auth with HttpOnly cookies. Register, Login, Logout, Profile endpoints working. |
| **Task Management** | ✅ Completed | CRUD operations for tasks. Create, Read, Update, Delete fully functional. |
| **Real-time Updates** | ✅ Completed | Socket.io integration. Updates reflect instantly across connected clients. |
| **Filtering & Sorting** | ✅ Completed | Get Tasks API supports status, priority, and due date sorting. |
| **Validation** | ✅ Completed | Zod used for both frontend form validation and backend request validation. |
| **Error Handling** | ✅ Completed | Global error handler in backend. Toast notifications in frontend. |
| **Bonus: Audit Logs** | ✅ Completed | `AuditLog` model created and integrated into `taskService` to track task updates. |
| **Bonus: Docker** | ✅ Completed | Dockerfile and docker-compose.yml provided. |
| **Bonus: Optimistic UI** | ✅ Completed | React Query cache updates on socket events. |

## 🧪 Test Cases

| Test Case via UI/API | Expected Result | Status |
| :--- | :--- | :--- |
| **Register User** | User created, token set in cookie, redirected to dashboard. | ✅ Pass |
| **Login User** | Token set in cookie, redirected to dashboard. | ✅ Pass |
| **Create Task** | Task appears in list instantly (Socket.io). | ✅ Pass |
| **Update Task Status** | Status updates in DB and for all connected users (Socket.io). | ✅ Pass |
| **Assign Task** | Notification sent to assignee (if different user). | ✅ Pass |
| **Delete Task** | Task removed from list for all users. | ✅ Pass |
| **Audit Log Entry** | Updating a task creates an entry in `AuditLog` collection. | ✅ Pass |
| **Automated Tests** | `npm test` runs successfully. | ✅ Pass |

## 📡 API Contract

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user info
- `POST /api/auth/logout` - Logout

### Tasks
- `GET /api/tasks` - Get all tasks (supports query params: status, priority, sortBy, sortOrder)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🏗️ Architecture & Design

- **Service-Oriented Architecture**: Business logic is separated into `services/` (e.g., `taskService.ts`), keeping controllers lean.
- **DTO Validation**: Zod schemas in `utils/validation.ts` ensure data integrity before reaching the service layer.
- **Repository Pattern**: Mongoose models act as the data access layer.
- **Real-Time Strategy**: Socket.io is initialized in `utils/socket.ts` and used within services to emit events (`taskCreated`, `taskUpdated`) directly after DB operations.
- **Optimistic UI**: Frontend listens to socket events and immediately updates the React Query cache via `setQueryData` for instant feedback.
