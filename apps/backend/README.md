# Task Management App - Backend

This is the backend implementation for the **Task Management App**. The backend is built using **Node.js**, **Express**, **TypeScript**, and **Xata** for the database. The app allows users to create or join teams, manage tasks within projects, and interact with task comments and notifications.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Database Structure](#database-structure)
7. [Testing](#testing)
8. [Technologies Used](#technologies-used)

## Project Overview

This Task Management App enables users to:

- Register and log in with JWT authentication.
- Create or join teams.
- Manage projects and tasks within teams.
- Assign tasks, set due dates, and track progress.
- Comment on tasks and receive notifications for upcoming deadlines.

The app includes user authentication and authorization to control access based on roles (e.g., Admin, Team Member).

## Features

### 1. User Authentication & Authorization

- **JWT-based Authentication**: Users can register and log in.
- **Role Management**: Roles include Admin and Team Member, with protected routes based on roles.
- **Password Security**: Passwords are hashed using bcrypt.

### 2. Teams and Projects

- Users can create or join teams.
- Teams contain multiple projects.
- Projects have tasks that can be assigned to team members.

### 3. Task Management

- CRUD operations for tasks.
- Assign tasks to specific team members.
- Set due dates, track progress (in-progress, completed), and leave comments.

### 4. Notification System

- Notifications for upcoming task deadlines and project updates.

### 5. Testing

- Unit tests for API endpoints and services.
- Integration tests to ensure smooth operation across all components.
- Mock Xata responses to simulate database interactions.

## Project Structure

### Tables/Models:

- **User**: `{ id, name, email, password, role }`
- **Team**: `{ id, name, description, adminId (foreign key to User) }`
- **Project**: `{ id, name, teamId (foreign key to Team) }`
- **Task**: `{ id, description, status, dueDate, projectId (foreign key to Project), assignedToId (foreign key to User) }`
- **Comment**: `{ id, content, taskId (foreign key to Task), userId (foreign key to User) }`

### Routes:

- **/auth/register**: Register a user (Admin or Team Member).
- **/auth/login**: Login with JWT generation.
- **/teams**: Create, update, join, leave a team.
- **/projects**: CRUD operations for projects within a team.
- **/tasks**: CRUD for tasks, task assignment, status updates.
- **/comments**: Add comments to tasks.

### Controllers:

- **AuthController**: Handles registration, login, and JWT authentication.
- **TeamController**: Manages team creation, joining, and leaving.
- **ProjectController**: CRUD operations for projects.
- **TaskController**: CRUD for tasks, task assignment, filtering by status, and member.
- **CommentController**: Handles adding/viewing comments.

### Middleware:

- **JWT Authentication**: Protects routes.
- **Role-based Access Control**: Admin can manage teams and projects.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/victorkamoto/QA-Group-Project-1.git
   cd QA-Group-Project-1/apps/backend
    ```

1. Install dependencies:

   ```bash
   pnpm install
   ```

1. Create a `.env` file in the root directory and add the following environment variables:

   ```env
    PORT=3000
    JWT_SECRET=your_secret_key
    JWT_EXPIRES_IN=1d
    XATA_API_KEY=your_xata_api_key
    XATA_BRANCH=your_xata_branch
    ```

1. Start the server:

    ```bash
    pnpm run dev
    ```

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in and receive a JWT token.

### Teams

- **POST /teams**: Create a new team.
- **PATCH /teams**: Update team details.
- **POST /teams/join**: Join a team.

### Projects

- **POST /projects**: Create a new project within a team.
- **PATCH /projects**: Update project details.
- **DELETE /projects**: Delete a project.

### Tasks

- **POST /tasks**: Create a task within a project.
- **PATCH /tasks**: Update task details (including status).
- **DELETE /tasks**: Delete a task.

### Comments

- **POST /comments**: Add a comment to a task.

## Database Structure

The app uses Xata as the database provider. The main tables and relationships are as follows:

- **User-Teams**: Many-to-Many
- **Team-Projects**: One-to-Many
- **Project-Tasks**: One-to-Many
- **Task-Comments**: One-to-Many

## Testing

This app uses the Jest testing framework for unit and integration tests. The tests are located in the `src/__tests__` directory.

To run tests, use the following command:

```bash
pnpm test
```

## Technologies Used

- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) for the backend.
- [TypeScript](https://www.typescriptlang.org/) for type safety and structure.
- [Xata](https://xata.io/) for the database.
- [JWT](https://jwt.io/) for authentication.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing.
- [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest) for testing.
