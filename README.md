# WorkflowX

WorkflowX is a full-stack task and project management system built for teams that need a clean workflow for planning, assigning, tracking, and completing work.

It combines a modern React frontend with an Express and MongoDB backend to support authentication, project organization, task tracking, team management, and notifications in one application.

## Key Features

- Secure JWT-based authentication with protected routes
- Dashboard with task statistics, recent tasks, and project progress
- Task management with list and kanban-style views
- Project management with members, deadlines, status, and progress tracking
- Team management with role updates and admin-only controls
- In-app notifications for task assignments and task status activity
- Profile management for user account updates
- REST API structure for auth, tasks, projects, users, and notifications

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```text
WorkflowX/
|- workflowx-client/   # React + Vite frontend
|- workflowx-server/   # Express + MongoDB backend
|- README.md
```

## Available Scripts

**Frontend**

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build

**Backend**

- `npm run dev` - start the backend with nodemon
- `npm start` - start the backend with Node.js

## Core Modules

- **Authentication**: Register, login, token-based session handling, protected routes
- **Tasks**: Create, update, delete, comment, assign, filter, and track task status
- **Projects**: Create projects, assign members, manage deadlines, and view progress
- **Team**: View members, update roles, and remove users with admin permissions
- **Notifications**: Track task-related updates inside the app

## API Overview

The backend is organized around these main route groups:

- `/api/auth`
- `/api/tasks`
- `/api/projects`
- `/api/users`
- `/api/notifications`

## Author

Allah Ditta  
GitHub: [@AllahDitta-1](https://github.com/AllahDitta-1)
