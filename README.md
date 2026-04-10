# Salary Management System

A full-stack web application for managing employee records and analyzing salary insights across departments, roles, and countries.

---

## Tech Stack

| Layer     | Technology                                                                 |
|-----------|---------------------------------------------------------------------------|
| Frontend  | React 19, Vite 8, Material UI 9, React Query, Recharts, React Router 7   |
| Backend   | Ruby on Rails 7.1 (API mode), Puma                                       |
| Database  | PostgreSQL                                                                |
| Testing   | RSpec, Factory Bot, Shoulda Matchers                                      |
| Tooling   | ESLint, Docker                                                            |

---

## Features

- Full CRUD for employee records (name, job title, department, country, salary, hire date, status)
- Salary insights by country, job title, and top roles
- Interactive dashboard with charts (Recharts)
- Search, filter, and pagination
- Health check endpoint
- Dockerized backend for production deployment

---

## Project Structure

```
├── backend/            # Rails API
│   ├── app/
│   │   ├── controllers/    # EmployeesController, InsightsController, HealthController
│   │   ├── models/         # Employee
│   │   ├── repositories/
│   │   ├── services/
│   │   └── views/
│   ├── config/
│   ├── db/
│   ├── spec/               # RSpec tests
│   └── Dockerfile
│
├── frontend/           # React SPA
│   ├── src/
│   │   ├── api/            # API client (Axios)
│   │   ├── components/     # Navbar, EmployeeFormDialog, DeleteConfirmDialog, etc.
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # EmployeesPage, InsightsPage
│   │   └── utils/
│   └── package.json
```

---

## Prerequisites

- Ruby 3.4.7
- Node.js (LTS recommended)
- pnpm
- PostgreSQL

---

## Getting Started

### Backend

```bash
cd backend
bundle install
```

Create and seed the database:

```bash
bin/rails db:create db:migrate db:seed
```

Start the server:

```bash
bin/rails server
```

The API runs on `http://localhost:3000` by default.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The app runs on `http://localhost:5173` by default.

---

## API Endpoints

| Method | Endpoint                        | Description                        |
|--------|----------------------------------|------------------------------------|
| GET    | `/employees`                    | List all employees                 |
| GET    | `/employees/:id`                | Get a single employee              |
| POST   | `/employees`                    | Create a new employee              |
| PATCH  | `/employees/:id`                | Update an employee                 |
| DELETE | `/employees/:id`                | Delete an employee                 |
| GET    | `/insights/country/:country`    | Salary insights by country         |
| GET    | `/insights/job_title`           | Salary insights by job title       |
| GET    | `/insights/top_roles`           | Top roles by salary                |
| GET    | `/health`                       | Application health check           |

---

## Running Tests

### Backend

```bash
cd backend
bundle exec rspec
```

### Frontend

```bash
cd frontend
pnpm lint
```

---

## Docker (Backend)

```bash
cd backend
docker build -t salary-backend .
docker run -p 3000:3000 -e BACKEND_DATABASE_PASSWORD=yourpassword salary-backend
```

---

## Environment Variables

| Variable                   | Description                  | Used By  |
|----------------------------|------------------------------|----------|
| `BACKEND_DATABASE_PASSWORD`| PostgreSQL password (prod)   | Backend  |
| `DATABASE_URL`             | Full database connection URL | Backend  |
| `RAILS_MAX_THREADS`       | Puma thread pool size        | Backend  |

---

## License

This project is proprietary. All rights reserved.
