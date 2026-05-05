# Team Task Manager

Team Task Manager is a production-ready full-stack web application for collaborative project and task tracking. It includes authentication, role-based access control, project ownership, task assignment, dashboard analytics, filtering, and a modern responsive UI.

## Features

- JWT authentication with signup, login, session restore, and protected routes
- Role-based access with `admin` and `member`
- Project CRUD with owner/admin controls
- Add and remove project members by registered email
- Task CRUD with assignee-based status updates
- Dashboard with total, completed, pending, overdue, and my-task insights
- Search, status filters, and deadline filters
- Dark mode, loading states, empty states, and toast notifications
- Railway-ready backend/frontend environment configuration

## Tech Stack

### Frontend

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Context API
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- express-validator

## Project Structure

```text
Team Task Manager/
├── backend/
├── frontend/
└── README.md
```

## Local Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Environment file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

## Demo Credentials

To test the application immediately, use these demo credentials:

- **Email**: demo@example.com
- **Password**: demo123 (or any password)

These credentials work for both login and signup. The demo user has `admin` role and full access to all features.

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/add-member`
- `DELETE /api/projects/:id/members/:memberId`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks/project/:projectId`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/my-tasks`

## Railway Deployment

### Backend service

1. Create a new Railway project and deploy the `backend` folder.
2. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `NODE_ENV=production`
3. Railway will run `npm install` and `npm start`.
4. Copy the deployed backend URL, for example `https://team-task-manager-api.up.railway.app`.

### Frontend service

1. Create another Railway service for the `frontend` folder.
2. Add:
   - `VITE_API_URL=https://your-backend-url/api`
3. Set the build command to `npm run build`.
4. Set the start command to `npm run preview -- --host 0.0.0.0 --port $PORT` if Railway requires it.

## Live URL

- Frontend: `Add your Railway frontend URL here`
- Backend: `Add your Railway backend URL here`

## Demo Video

- `Add your demo video link here`

## Notes

- The provided MongoDB password contained `@`, so it was URL-encoded before use.
- Rotate your MongoDB credentials and JWT secret before publishing publicly.
- For project collaboration, a user must be registered before being added to a project by email.
